/*!
 * Star Rating
 * @version: 3.1.5
 * @author: Paul Ryley (http://geminilabs.io)
 * @url: https://github.com/pryley/star-rating.js
 * @license: MIT
 */
/** global: define, Event */
(function (window, document, undefined) {
    const handle = 'star-rating';

    /** @return object */
    const Plugin = function (selector, options) { // string|object|NodeList, object
        const selectorType = {}.toString.call(selector);
        if (selectorType === '[object String]') {
            this.selects = document.querySelectorAll(selector);
        } else if (selectorType === '[object NodeList]') {
            this.selects = selector;
        } else {
            this.selects = [selector];
        }
        this.destroy = function () {
            this.widgets.forEach((widget) => {
                widget.destroy_();
            });
        };
        this.rebuild = function () {
            this.widgets.forEach((widget) => {
                widget.rebuild_();
            });
        };
        this.widgets = [];
        for (let i = 0; i < this.selects.length; i++) {
            if (this.selects[i].tagName !== 'SELECT' || this.selects[i][handle]) continue;
            const widget = new Widget(this.selects[i], options);
            if (widget.direction === undefined) continue;
            this.widgets.push(widget);
        }
    };

    /** @return void */
    var Widget = function (el, options) { // HTMLElement, object|null
        this.el = el;
        this.options_ = this.extend_({}, this.defaults_, options || {}, JSON.parse(el.getAttribute('data-options')));
        this.setStarCount_();
        if (this.stars < 1 || this.stars > this.options_.maxStars) return;
        this.init_();
    };

    Widget.prototype = {

        defaults_: {
            classname: 'gl-star-rating',
            clearable: true,
            initialText: 'Select a Rating',
            maxStars: 10,
            showText: true,
        },

        /** @return void */
        init_() {
            this.initEvents_();
            this.current = this.selected = this.getSelectedValue_();
            this.wrapEl_();
            this.buildWidgetEl_();
            this.setDirection_();
            this.setValue_(this.current);
            this.handleEvents_('add');
            this.el[handle] = true;
        },

        /** @return void */
        buildLabelEl_() {
            if (!this.options_.showText) return;
            this.textEl = this.insertSpanEl_(this.widgetEl, {
                class: `${this.options_.classname}-text`,
            }, true);
        },

        /** @return void */
        buildWidgetEl_() {
            const values = this.getOptionValues_();
            const widgetEl = this.insertSpanEl_(this.el, {
                class: `${this.options_.classname}-stars`,
            }, true);
            for (const key in values) {
                const newEl = this.createSpanEl_({
                    'data-value': key,
                    'data-text': values[key],
                });
                widgetEl.innerHTML += newEl.outerHTML;
            }
            this.widgetEl = widgetEl;
            this.buildLabelEl_();
        },

        /** @return void */
        changeTo_(index) { // int
            if (index < 0 || isNaN(index)) {
                index = 0;
            }
            if (index > this.stars) {
                index = this.stars;
            }
            this.widgetEl.classList.remove(`s${10 * this.current}`);
            this.widgetEl.classList.add(`s${10 * index}`);
            if (this.options_.showText) {
                this.textEl.textContent = index < 1 ? this.options_.initialText : this.widgetEl.childNodes[index - 1].dataset.text;
            }
            this.current = index;
        },

        /** @return HTMLElement */
        createSpanEl_(attributes) { // object
            const el = document.createElement('span');
            attributes = attributes || {};
            for (const key in attributes) {
                el.setAttribute(key, attributes[key]);
            }
            return el;
        },

        /** @return void */
        destroy_() {
            this.handleEvents_('remove');
            const wrapEl = this.el.parentNode;
            wrapEl.parentNode.replaceChild(this.el, wrapEl);
            delete this.el[handle];
        },

        /** @return void */
        eventListener_(el, action, events) { // HTMLElement, string, array
            events.forEach((event) => {
                el[`${action}EventListener`](event, this.events[event]);
            });
        },

        /** @return object */
        extend_() { // ...object
            const args = [].slice.call(arguments);
            const result = args[0];
            const extenders = args.slice(1);
            Object.keys(extenders).forEach((i) => {
                for (const key in extenders[i]) {
                    if (!extenders[i].hasOwnProperty(key)) continue;
                    result[key] = extenders[i][key];
                }
            });
            return result;
        },

        /** @return int */
        getIndexFromEvent_(ev) { // MouseEvent|TouchEvent
            const direction = {};
            const pageX = ev.pageX || ev.changedTouches[0].pageX;
            const widgetWidth = this.widgetEl.offsetWidth;
            direction.ltr = Math.max(pageX - this.offsetLeft, 1);
            direction.rtl = widgetWidth - direction.ltr;
            return Math.min(
                Math.ceil(direction[this.direction] / Math.round(widgetWidth / this.stars)),
                this.stars,
            );
        },

        /** @return object */
        getOptionValues_() {
            const { el } = this;
            const unorderedValues = {};
            const orderedValues = {};
            for (let i = 0; i < el.length; i++) {
                if (this.isValueEmpty_(el[i])) continue;
                unorderedValues[el[i].value] = el[i].text;
            }
            Object.keys(unorderedValues).sort().forEach((key) => {
                orderedValues[key] = unorderedValues[key];
            });
            return orderedValues;
        },

        /** @return int */
        getSelectedValue_() {
            return parseInt(this.el.options[Math.max(this.el.selectedIndex, 0)].value) || 0;
        },

        /** @return void */
        handleEvents_(action) { // string
            const formEl = this.el.closest('form');
            if (formEl && formEl.tagName === 'FORM') {
                this.eventListener_(formEl, action, ['reset']);
            }
            this.eventListener_(this.el, action, ['change', 'keydown']);
            this.eventListener_(this.widgetEl, action, [
                'mousedown', 'mouseleave', 'mousemove', 'mouseover',
                'touchend', 'touchmove', 'touchstart',
            ]);
        },

        /** @return void */
        initEvents_() {
            this.events = {
                change: this.onChange_.bind(this),
                keydown: this.onKeydown_.bind(this),
                mousedown: this.onPointerdown_.bind(this),
                mouseleave: this.onPointerleave_.bind(this),
                mousemove: this.onPointermove_.bind(this),
                mouseover: this.onPointerover_.bind(this),
                reset: this.onReset_.bind(this),
                touchend: this.onPointerdown_.bind(this),
                touchmove: this.onPointermove_.bind(this),
                touchstart: this.onPointerover_.bind(this),
            };
        },

        /** @return void */
        insertSpanEl_(el, attributes, after) { // HTMLElement, object, bool
            const newEl = this.createSpanEl_(attributes);
            el.parentNode.insertBefore(newEl, after === true ? el.nextSibling : el);
            return newEl;
        },

        /** @return bool */
        isValueEmpty_(el) { // HTMLElement
            return el.getAttribute('value') === null || el.value === '';
        },

        /** @return void */
        onChange_() {
            this.changeTo_(this.getSelectedValue_());
        },

        /** @return void */
        onKeydown_(ev) { // KeyboardEvent
            if (!~['ArrowLeft', 'ArrowRight'].indexOf(ev.key)) return;
            let increment = ev.key === 'ArrowLeft' ? -1 : 1;
            if (this.direction === 'rtl') {
                increment *= -1;
            }
            this.setValue_(Math.min(Math.max(this.getSelectedValue_() + increment, 0), this.stars));
            this.triggerChangeEvent_();
        },

        /** @return void */
        onPointerdown_(ev) { // MouseEvent|TouchEvent
            ev.preventDefault();
            const index = this.getIndexFromEvent_(ev);
            if (this.current !== 0 && parseFloat(this.selected) === index && this.options_.clearable) {
                this.onReset_();
                this.triggerChangeEvent_();
                return;
            }
            this.setValue_(index);
            this.triggerChangeEvent_();
        },

        /** @return void */
        onPointerleave_(ev) { // MouseEvent
            ev.preventDefault();
            this.changeTo_(this.selected);
        },

        /** @return void */
        onPointermove_(ev) { // MouseEvent|TouchEvent
            ev.preventDefault();
            this.changeTo_(this.getIndexFromEvent_(ev));
        },

        /** @return void */
        onPointerover_(ev) { // MouseEvent|TouchEvent
            ev.preventDefault();
            const rect = this.widgetEl.getBoundingClientRect();
            this.offsetLeft = rect.left + document.body.scrollLeft;
        },

        /** @return void */
        onReset_() {
            const originallySelected = this.el.querySelector('[selected]');
            const value = originallySelected ? originallySelected.value : '';
            this.el.value = value;
            this.selected = parseInt(value) || 0;
            this.changeTo_(value);
        },

        /** @return void */
        rebuild_() {
            if (this.el.parentNode.classList.contains(this.options_.classname)) {
                this.destroy_();
            }
            this.init_();
        },

        /** @return void */
        setDirection_() {
            const wrapEl = this.el.parentNode;
            this.direction = window.getComputedStyle(wrapEl, null).getPropertyValue('direction');
            wrapEl.classList.add(`${this.options_.classname}-${this.direction}`);
        },

        /** @return void */
        setValue_(index) {
            this.el.value = this.selected = index;
            this.changeTo_(index);
        },

        /** @return void */
        setStarCount_() {
            const { el } = this;
            this.stars = 0;
            for (let i = 0; i < el.length; i++) {
                if (this.isValueEmpty_(el[i])) continue;
                if (isNaN(parseFloat(el[i].value)) || !isFinite(el[i].value)) {
                    this.stars = 0;
                    return;
                }
                this.stars++;
            }
        },

        /** @return void */
        triggerChangeEvent_() {
            this.el.dispatchEvent(new Event('change'));
        },

        /** @return void */
        wrapEl_() {
            const wrapEl = this.insertSpanEl_(this.el, {
                class: this.options_.classname,
                'data-star-rating': '',
            });
            wrapEl.appendChild(this.el);
        },
    };

    if (typeof define === 'function' && define.amd) {
        define([], () => Plugin);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = Plugin;
    } else {
        window.StarRating = Plugin;
    }
}(window, document));
