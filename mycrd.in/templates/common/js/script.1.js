window.mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

// set Country code
const input = document.querySelector('#whatsapp-input');
const iti = window.intlTelInput(input, {
    initialCountry: 'auto',
    geoIpLookup: (success) => {
        fetch('https://ipinfo.io', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                const countryCode = (data && data.country) ? data.country : '';
                success(countryCode);
            });
    },
});

// Get the modal
const imageModal = document.getElementById('imageModal');
const shareModal = document.getElementById('shareModal');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == imageModal || event.target == shareModal) {
        imageModal.style.display = 'none';
        shareModal.style.display = 'none';
    }
};

const modalImg = document.getElementById('img01');
const captionText = document.getElementById('caption');

function openImageModal(e) {
    imageModal.style.display = 'block';
    modalImg.src = e.src;
    captionText.innerHTML = e.alt;
}

// Get the <span> element that closes the modal
const imageModalClose = document.getElementById('imageModalClose');

// When the user clicks on <span> (x), close the modal
imageModalClose.onclick = function () {
    imageModal.style.display = 'none';
};


function openShareModal(e, title, fullUrl) {
    if (navigator.share) {
        navigator.share({
            title,
            url: fullUrl,
        }).then(() => {
            console.log('Thanks for sharing!');
        })
            .catch(console.error);
    } else {
        shareModal.style.display = 'flex';
    }
}

// Get the <span> element that closes the modal
const shareModalClose = document.getElementById('shareModalClose');

// When the user clicks on <span> (x), close the modal
shareModalClose.onclick = function () {
    shareModal.style.display = 'none';
};


function handleWhatsappShare(e, fullUrl) {
    const { value } = document.getElementById('whatsapp-input');

    if (value.length < 10) {
        e.preventDefault();
        return;
    }
    e.href = `https://wa.me/${iti.getNumber()}?text=${fullUrl}`;
}
function handleDirectWhatsappShare(e, whatsappNumberWithCountryCode, fullUrl) {
    if (window.mobileCheck()) {
        e.href = `whatsapp:\/\/send?text=${fullUrl}`;
    } else if (whatsappNumberWithCountryCode) {
        e.href = `https://wa.me/${whatsappNumberWithCountryCode}?text=${fullUrl}`;
    } else {
        e.href = `whatsapp:\/\/send?text=${fullUrl}`;
    }
}

function sendEnquiry(ele, mailTo) {
    ele.value = 'Sending...';
    ele.disabled = true;
    const name = document.getElementById('enquiryName');
    const phoneNumber = document.getElementById('phoneNumber');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const data = {};
    data.mailTo = mailTo;
    data.name = name.value;
    data.phoneNumber = phoneNumber.value;
    data.email = email.value;
    data.message = message.value;
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState === 4) {
            const response = JSON.parse(this.response);
            if (this.status === 200) {
                alert('Success: Mail sent Successfuly');
                name.value = '';
                phoneNumber.value = '';
                email.value = '';
                message.value = '';
            } else {
                alert(`Error in send enquiry: ${response.data.message}`);
            }
            ele.value = 'Send';
            ele.disabled = false;
        }
    };
    xhr.open('POST', '/api/v1/sendEnquiry');
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify(data));
}

// Feedback code
const starRatingControl = new StarRating('.star-rating', {
    maxStars: 5,
});

function sendFeedback(ele, cardId) {
    ele.value = 'Sending...';
    ele.disabled = true;
    const feedbackList = document.getElementsByClassName('feedback-list')[0];
    const rating = document.getElementById('rating');
    const name = document.getElementById('feedbackName');
    const feedback = document.getElementById('feedback');
    const data = {};
    data.cardId = cardId;
    data.rating = rating.value;
    data.name = name.value;
    data.feedback = feedback.value;
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState === 4) {
            const response = JSON.parse(this.response);
            if (this.status === 200) {
                alert('Success: Feedback Given Successfully');
                rating.value = '';
                name.value = '';
                feedback.value = '';

                // Pushing new feedback in the list
                const feedbackResponse = response.data.feedback;
                const newFeedback = `<div class="feedback-wrapper">
                    <span class="feedback-name-wrapper"><span class="feedback-name">${feedbackResponse.name}</span> on ${feedbackResponse.date} </span>
                    <div><span class="gl-star-rating-stars s${feedbackResponse.rating}0"><span data-value="1" data-text="Terrible"></span><span data-value="2" data-text="Poor"></span><span data-value="3" data-text="Average"></span><span data-value="4" data-text="Very Good"></span><span data-value="5" data-text="Excellent"></span></span></div>
                    <div>${feedbackResponse.feedback}</div>
                    <hr />
                </div>`;
                feedbackList.insertAdjacentHTML('afterbegin', newFeedback);
            } else {
                alert(`Error in sending feedback: ${response.data.message}`);
            }
            ele.value = 'Give Feedback';
            ele.disabled = false;
        }
    };
    xhr.open('POST', '/api/v1/feedback');
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify(data));
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then(
        () => {
            console.log('Service Worker Registered');
        },
    );
}

let feedbacks = [];
let totalFeedbacks = 0;
let currentFeedbackPage = 0;
const feedbackLimit = 5;

const getFeedbacks = (cardId, page, limit) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                const response = JSON.parse(this.response);
                if (this.status === 200) {
                    resolve(response.data);
                } else {
                    reject(response.data.message);
                }
            }
        };
        xhr.open('GET', `/api/v1/feedback?cardId=${cardId}&limit=${limit}&page=${page}`);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send();
    });
};
const renderFeedbacks = (feedbacksArr) => {
    const feedbackList = document.getElementById('feedback-list');
    feedbackList.innerHTML = '';
    const elements = feedbacksArr.map((feedback) => {
        return `<div class="feedback-wrapper">
            <span class="feedback-name-wrapper"><span class="feedback-name">${feedback.name}</span> on ${feedback.date} </span>
            <div><span class="gl-star-rating-stars s${feedback.rating}0"><span data-value="1" data-text="Terrible"></span><span data-value="2" data-text="Poor"></span><span data-value="3" data-text="Average"></span><span data-value="4" data-text="Very Good"></span><span data-value="5" data-text="Excellent"></span></span></div>
            <div>${feedback.feedback}</div>
            <hr />
        </div>`;
    });
    for (let i = 0; i < elements.length; i += 1) {
        feedbackList.insertAdjacentHTML('beforeend', elements[i]);
    }
};

const getAndRenderFeedbacks = async (cardId, element) => {
    try {
        if (element) {
            element.value = 'Loading...';
            element.disabled = true;
        }
        currentFeedbackPage += 1;
        const response = await getFeedbacks(cardId, currentFeedbackPage, feedbackLimit);
        totalFeedbacks = response.total;
        feedbacks = feedbacks.concat(
            response.list,
        );
        renderFeedbacks(feedbacks);

        if (totalFeedbacks <= feedbacks.length) {
            const loadMoreBtn = document.getElementById('load-more-feedback-btn');
            loadMoreBtn.style.display = 'none';
        }
        if (element) {
            element.value = 'Load more feedbacks';
            element.disabled = false;
        }
    } catch (ex) {
        alert(`Error in getting feedbacks: ${ex}`);
    }
};

window.addEventListener('DOMContentLoaded', () => {
    let deferredPrompt;
    const saveBtn = document.querySelector('.save-card-button');
    saveBtn.style.display = 'none';

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI to notify the user they can add to home screen
        saveBtn.style.display = 'block';

        saveBtn.addEventListener('click', (e) => {
            // hide our user interface that shows our A2HS button
            saveBtn.style.display = 'none';
            // Show the prompt
            deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                } else {
                    console.log('User dismissed the A2HS prompt');
                }
                deferredPrompt = null;
            });
        });
    });

    const feedbackList = document.getElementById('feedback-list');
    if (feedbackList) {
        getAndRenderFeedbacks(window.cardId);

        document.getElementById('load-more-feedback-btn')
            .addEventListener('click', (event) => {
                getAndRenderFeedbacks(window.cardId, event.target);
            });
    }
});
