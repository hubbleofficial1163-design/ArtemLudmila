const playerBtn = document.getElementById('playerBtn');
const audio = document.getElementById('audio');
let isPlaying = false;

playerBtn.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        playerBtn.src = 'player.png';
        playerBtn.classList.remove('is-stop');
        isPlaying = false;
    } else {
        audio.play();
        playerBtn.src = 'stop.png';
        playerBtn.classList.add('is-stop');
        isPlaying = true;
    }
});


const flow2 = document.getElementById('flow2');
const timingPath = document.getElementById('timingPath');
const timingSection = document.querySelector('.timing');
const lineContainer = document.querySelector('.timing-line-container');
const timingSvg = document.querySelector('.timing-line');

if (flow2 && timingPath && timingSection && lineContainer && timingSvg) {
    const pathLength = timingPath.getTotalLength();
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    let stableViewportHeight = window.innerHeight;
    let lastKnownWidth = window.innerWidth;
    let flowTicking = false;

    function refreshFlowMetrics(forceViewportUpdate = false) {
        const currentWidth = window.innerWidth;
        const currentHeight = window.innerHeight;
        const widthChanged = currentWidth !== lastKnownWidth;
        const heightDelta = Math.abs(currentHeight - stableViewportHeight);

        if (forceViewportUpdate || widthChanged || !isTouchDevice || heightDelta > 160) {
            stableViewportHeight = currentHeight;
        }

        lastKnownWidth = currentWidth;
    }

    function updateFlowPosition() {
        const sectionRect = timingSection.getBoundingClientRect();
        const containerRect = lineContainer.getBoundingClientRect();
        const sectionTop = sectionRect.top + window.pageYOffset;
        const sectionBottom = sectionRect.bottom + window.pageYOffset;
        const scrollPosition = window.pageYOffset + stableViewportHeight / 2;

        let progress = (scrollPosition - sectionTop) / (sectionBottom - sectionTop);
        progress = Math.max(0, Math.min(1, progress));

        const point = timingPath.getPointAtLength(progress * pathLength);
        const ctm = timingPath.getScreenCTM();

        if (!ctm) {
            return;
        }

        const svgPoint = timingSvg.createSVGPoint();
        svgPoint.x = point.x;
        svgPoint.y = point.y;

        const screenPoint = svgPoint.matrixTransform(ctm);
        const flowWidth = flow2.offsetWidth;
        const flowHeight = flow2.offsetHeight;

        flow2.style.left = (screenPoint.x - containerRect.left - flowWidth / 2) + 'px';
        flow2.style.top = (screenPoint.y - containerRect.top - flowHeight / 2) + 'px';
    }

    function requestFlowUpdate() {
        if (flowTicking) {
            return;
        }

        flowTicking = true;
        window.requestAnimationFrame(() => {
            updateFlowPosition();
            flowTicking = false;
        });
    }

    refreshFlowMetrics(true);

    window.addEventListener('scroll', requestFlowUpdate, { passive: true });
    window.addEventListener('resize', () => {
        refreshFlowMetrics();
        requestFlowUpdate();
    });
    window.addEventListener('orientationchange', () => {
        refreshFlowMetrics(true);
        requestFlowUpdate();
    });
    window.addEventListener('load', () => {
        refreshFlowMetrics(true);
        requestFlowUpdate();
    });

    requestFlowUpdate();
}


const revealItems = document.querySelectorAll('.reveal-on-scroll');

if (revealItems.length) {
    let revealTicking = false;

    function updateRevealItems() {
        const viewportTop = window.innerHeight * 0.12;
        const viewportBottom = window.innerHeight * 0.9;

        revealItems.forEach((item) => {
            const rect = item.getBoundingClientRect();
            const isVisible = rect.top < viewportBottom && rect.bottom > viewportTop;
            const isDressCodeItem = item.closest('.dress-code');
            const isDetailsItem = item.closest('.details');
            const isRsvpItem = item.closest('.rsvp');

            if (isDressCodeItem || isDetailsItem || isRsvpItem) {
                if (isVisible) {
                    item.classList.add('is-visible');
                }
                return;
            }

            item.classList.toggle('is-visible', isVisible);
        });

        revealTicking = false;
    }

    function requestRevealUpdate() {
        if (revealTicking) {
            return;
        }

        revealTicking = true;
        window.requestAnimationFrame(updateRevealItems);
    }

    window.addEventListener('scroll', requestRevealUpdate, { passive: true });
    window.addEventListener('resize', requestRevealUpdate);
    window.addEventListener('load', requestRevealUpdate);
    requestRevealUpdate();
}


const rsvpForm = document.getElementById('rsvpForm');
const rsvpError = document.getElementById('rsvpError');
const rsvpSuccess = document.getElementById('rsvpSuccess');

if (rsvpForm && rsvpError && rsvpSuccess) {
    rsvpForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(rsvpForm);
        const guestName = (formData.get('guest_name') || '').toString().trim();
        const attendance = formData.get('attendance');
        const drinks = formData.getAll('drinks');

        const isValid = guestName && attendance && drinks.length > 0;

        rsvpError.hidden = !!isValid;
        rsvpSuccess.hidden = !isValid;

        if (!isValid) {
            return;
        }

        rsvpForm.reset();
    });
}
