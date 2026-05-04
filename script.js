// Музыкальный плеер
const playerBtn = document.getElementById('playerBtn');
const audio = document.getElementById('audio');
let isPlaying = false;

if (playerBtn && audio) {
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
}

// ========== БАЗОВЫЕ СТИЛИ АНИМАЦИЙ ==========
const coreStyles = document.createElement('style');
coreStyles.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(coreStyles);

// ========== УНИВЕРСАЛЬНОЕ МОДАЛЬНОЕ ОКНО ==========
function showModal(title, message, isError = false) {
    const existingModal = document.getElementById('customModal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'customModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;

    const icon = isError ? '✕' : '✓';
    const iconColor = isError ? '#c62828' : '#2e7d32';
    const bgIconColor = isError ? '#ffebee' : '#e8f5e9';
    const borderColor = isError ? '#c62828' : '#2e7d32';

    modal.innerHTML = `
        <div style="
            background: #ffffff;
            border-radius: 16px;
            padding: 32px 40px;
            max-width: 380px;
            width: 90%;
            text-align: center;
            box-shadow: 0 20px 35px rgba(0, 0, 0, 0.15);
            animation: slideUp 0.3s ease;
            border-top: 3px solid ${borderColor};
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        ">
            <div style="
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: ${bgIconColor};
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px auto;
            ">
                <div style="
                    font-size: 32px;
                    font-weight: 400;
                    color: ${iconColor};
                    line-height: 1;
                ">${icon}</div>
            </div>
            <h3 style="
                font-size: 24px;
                font-weight: 500;
                color: #1a1a1a;
                margin-bottom: 12px;
                letter-spacing: -0.3px;
            ">${title}</h3>
            <p style="
                font-size: 16px;
                color: #555555;
                margin-bottom: 28px;
                line-height: 1.5;
            ">${message}</p>
            <button onclick="this.closest('#customModal').remove()" style="
                background: #f5f5f5;
                color: #333333;
                border: none;
                padding: 12px 32px;
                border-radius: 40px;
                font-family: inherit;
                font-size: 15px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
            " onmouseover="this.style.background='#e8e8e8'" onmouseout="this.style.background='#f5f5f5'">
                Закрыть
            </button>
        </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });

    if (!isError) {
        setTimeout(() => {
            if (modal.parentElement) modal.remove();
        }, 4000);
    }
}

// ========== МОДАЛЬНОЕ ОКНО ЗАГРУЗКИ ==========
function showLoadingModal() {
    const existingLoading = document.getElementById('loadingModal');
    if (existingLoading) existingLoading.remove();
    
    const loadingModal = document.createElement('div');
    loadingModal.id = 'loadingModal';
    loadingModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(3px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;
    loadingModal.innerHTML = `
        <div style="
            background: white;
            border-radius: 16px;
            padding: 32px 40px;
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        ">
            <div style="
                width: 50px;
                height: 50px;
                border: 3px solid #e0e0e0;
                border-top-color: #78806A;
                border-radius: 50%;
                margin: 0 auto 20px;
                animation: spin 1s linear infinite;
            "></div>
            <p style="
                font-size: 15px;
                color: #666;
                margin: 0;
            ">Отправка ответа...</p>
        </div>
    `;
    document.body.appendChild(loadingModal);
    return loadingModal;
}

// ========== GOOGLE SHEETS ==========
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby6gqzIWhKLyeHYdjql8Kc8P2OSeHYNT_JUaefXFutsp-qMemewsh5Uj8jXoyyCvpR88w/exec'; // ЗАМЕНИТЕ НА ВАШ URL

// Анимация появления элементов при скролле
const revealItems = document.querySelectorAll('.reveal-on-scroll');

if (revealItems.length) {
    let revealTicking = false;

    function updateRevealItems() {
        const viewportTop = window.innerHeight * 0.12;
        const viewportBottom = window.innerHeight * 0.9;

        revealItems.forEach((item) => {
            const rect = item.getBoundingClientRect();
            const isVisible = rect.top < viewportBottom && rect.bottom > viewportTop;
            const isHeroItem = item.closest('.hero');
            const isDressCodeItem = item.closest('.dress-code');
            const isDetailsItem = item.closest('.details');
            const isRsvpItem = item.closest('.rsvp');

            if (isHeroItem) {
                item.classList.toggle('is-visible', isVisible);
                return;
            }

            if (isDressCodeItem || isDetailsItem || isRsvpItem) {
                if (isVisible) {
                    item.classList.add('is-visible');
                }
                return;
            }

            if (isVisible) {
                item.classList.add('is-visible');
            }
        });

        revealTicking = false;
    }

    function requestRevealUpdate() {
        if (revealTicking) return;
        revealTicking = true;
        window.requestAnimationFrame(updateRevealItems);
    }

    window.addEventListener('scroll', requestRevealUpdate, { passive: true });
    window.addEventListener('resize', requestRevealUpdate);
    window.addEventListener('load', requestRevealUpdate);
    requestRevealUpdate();
}

// Анимация для SVG линии
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

        if (!ctm) return;

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
        if (flowTicking) return;
        flowTicking = true;
        window.requestAnimationFrame(() => {
            updateFlowPosition();
            flowTicking = false;
        });
    }

    refreshFlowMetrics(true);

    window.addEventListener('scroll', requestFlowUpdate, { passive: true });
    window.addEventListener('resize', () => { refreshFlowMetrics(); requestFlowUpdate(); });
    window.addEventListener('orientationchange', () => { refreshFlowMetrics(true); requestFlowUpdate(); });
    window.addEventListener('load', () => { refreshFlowMetrics(true); requestFlowUpdate(); });

    requestFlowUpdate();
}

// ========== ОТПРАВКА ФОРМЫ В GOOGLE SHEETS ==========
const rsvpForm = document.getElementById('rsvpForm');
const rsvpError = document.getElementById('rsvpError');
const rsvpSuccess = document.getElementById('rsvpSuccess');

if (rsvpForm) {
    rsvpForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Получаем данные формы
        const guestName = document.querySelector('input[name="guest_name"]').value.trim();
        const attendanceRadio = document.querySelector('input[name="attendance"]:checked');
        const attendance = attendanceRadio ? attendanceRadio.value : null;
        
        const drinksCheckboxes = document.querySelectorAll('input[name="drinks"]:checked');
        const drinksValues = Array.from(drinksCheckboxes).map(cb => cb.value);
        
        const allergy = document.querySelector('input[name="allergy"]').value.trim();

        // Валидация
        if (!guestName) {
            if (rsvpError) {
                rsvpError.textContent = 'Пожалуйста, укажите ваше имя';
                rsvpError.hidden = false;
            }
            return;
        }
        
        if (!attendance) {
            if (rsvpError) {
                rsvpError.textContent = 'Пожалуйста, выберите вариант присутствия';
                rsvpError.hidden = false;
            }
            return;
        }

        // Показываем загрузку
        const submitBtn = document.querySelector('.rsvp-submit');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';
        
        const loadingModal = showLoadingModal();
        
        try {
            // Формируем данные для отправки
            const formDataToSend = new URLSearchParams();
            formDataToSend.append('name', guestName);
            formDataToSend.append('attendance', attendance);
            formDataToSend.append('allergy', allergy);
            
            for (const drink of drinksValues) {
                formDataToSend.append('drinks', drink);
            }
            
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formDataToSend.toString()
            });
            
            const result = await response.json();
            
            loadingModal.remove();
            
            if (result.result === 'success') {
                // Показываем успех
                if (rsvpSuccess) {
                    rsvpSuccess.textContent = 'Спасибо! Ваш ответ успешно отправлен!';
                    rsvpSuccess.hidden = false;
                }
                if (rsvpError) rsvpError.hidden = true;
                
                // Показываем красивое модальное окно
                if (attendance === 'Я приду / Мы придем') {
                    showModal(
                        'Спасибо, ' + guestName + '!',
                        'Мы будем ждать вас на нашей свадьбе 5 сентября 2026 года! 🎉',
                        false
                    );
                } else {
                    showModal(
                        'Спасибо за ответ!',
                        'Очень жаль, что вы не сможете быть с нами в этот день.',
                        false
                    );
                }
                
                // Очищаем форму
                rsvpForm.reset();
                
                // Скрываем сообщение успеха через 4 секунды
                setTimeout(() => {
                    if (rsvpSuccess) rsvpSuccess.hidden = true;
                }, 4000);
            } else {
                throw new Error(result.message || 'Ошибка отправки');
            }
        } catch (error) {
            loadingModal.remove();
            if (rsvpError) {
                rsvpError.textContent = error.message || 'Произошла ошибка при отправке. Попробуйте ещё раз.';
                rsvpError.hidden = false;
            }
            showModal('Ошибка', error.message || 'Произошла ошибка при отправке. Пожалуйста, попробуйте ещё раз.', true);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}
