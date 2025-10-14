(() => {
	const navLinks = Array.from(document.querySelectorAll('.page__nav a'));
	const sectionMap = new Map();

	const setActiveNav = (link) => {
		navLinks.forEach((item) => item.classList.remove('is-active'));
		if (link) {
			link.classList.add('is-active');
		}
	};

	navLinks.forEach((link) => {
		const hash = link.getAttribute('href');
		if (!hash || !hash.startsWith('#')) {
			return;
		}
		const section = document.querySelector(hash);
		if (section) {
			sectionMap.set(section, link);
		}
	});

	if (sectionMap.size && 'IntersectionObserver' in window) {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const link = sectionMap.get(entry.target) || null;
						setActiveNav(link);
					}
				});
			},
			{ rootMargin: '-45% 0px -45% 0px', threshold: 0.25 }
		);
		sectionMap.forEach((_, section) => observer.observe(section));
	}

	navLinks.forEach((link) => {
		link.addEventListener('click', () => {
			setActiveNav(link);
		});
	});

	if (navLinks.length) {
		setActiveNav(navLinks[0]);
	}

	const modal = document.querySelector('#event-modal');
	const modalWindow = modal ? modal.querySelector('.modal__window') : null;
	const modalContent = modal ? modal.querySelector('.modal__content') : null;
	const closeTriggers = modal ? Array.from(modal.querySelectorAll('[data-modal-close]')) : [];
	const eventButtons = Array.from(document.querySelectorAll('[data-event-id]'));
	const FOCUSABLE_SELECTOR =
		'a[href], button:not([disabled]), textarea, input, select, summary, details, [tabindex]:not([tabindex="-1"])';
	let lastFocusedTrigger = null;
	let focusableElements = [];
	let firstFocusable = null;
	let lastFocusable = null;

	if (!modal || !modalWindow || !modalContent) {
		return;
	}

	eventButtons.forEach((button) => {
		button.setAttribute('aria-haspopup', 'dialog');
		button.setAttribute('aria-controls', modal.id);
		button.setAttribute('aria-expanded', 'false');
	});

	const closeModal = () => {
		if (modal.hidden) {
			return;
		}
		modal.hidden = true;
		modalContent.innerHTML = '';
		modal.removeAttribute('aria-labelledby');
		document.body.classList.remove('is-modal-open');
		modalWindow.removeEventListener('keydown', trapFocusInsideModal);
		focusableElements = [];
		firstFocusable = null;
		lastFocusable = null;
		if (lastFocusedTrigger) {
			lastFocusedTrigger.setAttribute('aria-expanded', 'false');
		}
		if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function') {
			lastFocusedTrigger.focus();
		}
		lastFocusedTrigger = null;
	};

	const setModalFocusables = () => {
		focusableElements = Array.from(
			modalWindow.querySelectorAll(FOCUSABLE_SELECTOR)
		).filter(
			(element) =>
				!element.hasAttribute('disabled') &&
				!element.getAttribute('aria-hidden') &&
				element.offsetParent !== null
		);
		firstFocusable = focusableElements[0] || modalWindow;
		lastFocusable = focusableElements[focusableElements.length - 1] || modalWindow;
	};

	const trapFocusInsideModal = (event) => {
		if (event.key !== 'Tab') {
			return;
		}
		if (!focusableElements.length) {
			event.preventDefault();
			modalWindow.focus();
			return;
		}
		const activeElement = document.activeElement;
		if (event.shiftKey) {
			if (activeElement === firstFocusable) {
				event.preventDefault();
				lastFocusable.focus();
			}
			return;
		}
		if (activeElement === lastFocusable) {
			event.preventDefault();
			firstFocusable.focus();
		}
	};

	const openModal = (button) => {
		const eventId = button?.dataset?.eventId;
		if (!eventId) {
			return;
		}
		const template = document.getElementById(`event-${eventId}`);
		if (!template) {
			return;
		}
		lastFocusedTrigger = button;
		button.setAttribute('aria-expanded', 'true');
		modalContent.innerHTML = '';
		modalContent.appendChild(template.content.cloneNode(true));
		modal.hidden = false;
		document.body.classList.add('is-modal-open');
		modal.setAttribute('aria-labelledby', `event-${eventId}-title`);
		modalWindow.scrollTo({ top: 0 });
		setModalFocusables();
		modalWindow.addEventListener('keydown', trapFocusInsideModal);
		if (firstFocusable && typeof firstFocusable.focus === 'function') {
			firstFocusable.focus();
		} else {
			modalWindow.focus();
		}
	};

	eventButtons.forEach((button) => {
		button.addEventListener('click', () => openModal(button));
	});

	closeTriggers.forEach((trigger) => {
		trigger.addEventListener('click', () => closeModal());
	});

	modal.addEventListener('click', (event) => {
		const target = event.target;
		if (target && target.hasAttribute('data-modal-close')) {
			closeModal();
			return;
		}
		if (target === modal) {
			closeModal();
		}
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') {
			closeModal();
		}
	});
})();
