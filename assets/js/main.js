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
	// 타임라인 페이지에서 내비게이션, 모달, 용어집 툴팁을 제어하는 즉시 실행 함수입니다.
	let firstFocusable = null;
		// 헤더 내비게이션 링크 목록과 각 섹션을 매핑합니다.
	let lastFocusable = null;

	if (!modal || !modalWindow || !modalContent) {
		// 현재 보고 있는 섹션에 맞춰 내비게이션에 강조 표시를 붙입니다.
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
		// 스크롤로 섹션이 화면 가운데로 들어오면 해당 내비게이션을 활성화합니다.
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

		// 모달 구조와 버튼 등 재사용할 DOM 요소를 미리 찾아 둡니다.
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
		// 모달 구성이 정상적이지 않다면 즉시 종료해 불필요한 에러를 막습니다.
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
		// 모달 닫기 공통 로직: 내용 정리, 포커스 복귀, 이벤트 정리 등을 한 번에 처리합니다.

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

		// 초보자용 용어 툴팁 적용: 템플릿 내용이 삽입된 직후에 실행
		applyGlossaryTooltips(modalContent);
	};

	// 간단한 용어집: 주요 전문 용어와 쉬운 설명
	const GLOSSARY = {
		"Ethernet": "여러 장치가 같은 케이블로 데이터를 주고받을 수 있게 해 주는 컴퓨터 네트워크 기술의 한 종류입니다.",
		"TSN": "Time-Sensitive Networking의 약자. 공장의 기기들처럼 시간이 아주 중요한 데이터를 우선 처리하도록 도와주는 이더넷 기술입니다.",
		"IEEE": "전기·전자 표준을 정하는 국제 기관 이름입니다. (예: IEEE 802.3은 이더넷 표준입니다)",
		"프레임": "네트워크에서 보내는 하나의 데이터 묶음(편지 한 통 같은 역할)입니다.",
		"지터": "데이터가 도착하는 시간의 들쭉날쭉함을 뜻합니다. 일정하지 않으면 실시간 서비스에 문제가 생깁니다."
	};

	const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

	function applyGlossaryTooltips(root) {
		if (!root) return;
		const terms = Object.keys(GLOSSARY).map(escapeRegExp).join("|");
		if (!terms) return;
		const re = new RegExp(`\\b(${terms})\\b`, 'g');

		// 텍스트 노드만 순회하며 치환
		const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
		const nodes = [];
		while (walker.nextNode()) nodes.push(walker.currentNode);

		nodes.forEach((textNode) => {
			const parent = textNode.parentNode;
			if (!parent || parent.closest('abbr')) return; // 이미 감싸진 경우 스킵
			const text = textNode.nodeValue;
			if (!re.test(text)) return;
			const frag = document.createDocumentFragment();
			let lastIndex = 0;
			text.replace(re, (match, p1, offset) => {
				if (offset > lastIndex) {
					frag.appendChild(document.createTextNode(text.slice(lastIndex, offset)));
				}
				const abbr = document.createElement('abbr');
				abbr.textContent = match;
				abbr.title = GLOSSARY[match] || GLOSSARY[p1] || '';
				abbr.className = 'glossary-abbr';
				frag.appendChild(abbr);
				lastIndex = offset + match.length;
				return match;
			});
			if (lastIndex < text.length) {
				frag.appendChild(document.createTextNode(text.slice(lastIndex)));
			}
			parent.replaceChild(frag, textNode);
		});
	}

	// 툴팁 엘리먼트 생성
	function createTooltip() {
		let tip = document.createElement('div');
		tip.className = 'glossary-tooltip';
		tip.style.display = 'none';
		tip.style.opacity = '0';
		document.body.appendChild(tip);
		return tip;
	}

	const tooltip = createTooltip();
	let tooltipHideTimer = null;

	function showTooltipFor(abbr) {
		if (!abbr) return;
		const text = abbr.title || '';
		tooltip.textContent = text;
		tooltip.style.display = 'block';
		// 렌더링 후 치수 읽기
		requestAnimationFrame(() => {
			const rect = abbr.getBoundingClientRect();
			const tipW = tooltip.offsetWidth;
			const tipH = tooltip.offsetHeight;
			let left = rect.left + window.scrollX + rect.width / 2 - tipW / 2;
			left = Math.max(8 + window.scrollX, Math.min(left, window.scrollX + window.innerWidth - tipW - 8));
			// 기본은 아래에 표시, 아래로 넘치면 위에 표시
			let top = rect.bottom + window.scrollY + 8;
			if (top + tipH > window.scrollY + window.innerHeight - 8) {
				top = rect.top + window.scrollY - tipH - 8;
			}
			tooltip.style.left = left + 'px';
			tooltip.style.top = top + 'px';
			tooltip.style.opacity = '1';
		});
		if (tooltipHideTimer) {
			clearTimeout(tooltipHideTimer);
			tooltipHideTimer = null;
		}
		// 자동 숨김(예: 모바일에서 오래 보이지 않게)
		tooltipHideTimer = setTimeout(() => {
			hideTooltip();
		}, 5000);
	}

	function hideTooltip() {
		if (tooltipHideTimer) {
			clearTimeout(tooltipHideTimer);
			tooltipHideTimer = null;
		}
		tooltip.style.opacity = '0';
		// fade 아웃 후 숨김
		setTimeout(() => {
			tooltip.style.display = 'none';
		}, 200);
	}

	// hover 처리 (데스크톱)
	document.addEventListener('mouseover', (e) => {
		const abbr = e.target.closest && e.target.closest('.glossary-abbr');
		if (!abbr) return;
		showTooltipFor(abbr);
	});
	document.addEventListener('mouseout', (e) => {
		const related = e.relatedTarget;
		if (related && related.closest && related.closest('.glossary-abbr')) return;
		hideTooltip();
	});

	// 클릭/터치 처리 (모바일 포함) - 이벤트 위임
	document.addEventListener('click', (e) => {
		const abbr = e.target.closest && e.target.closest('.glossary-abbr');
		if (!abbr) return;
		e.preventDefault();
		e.stopPropagation();
		// 같은 내용이면 토글
		if (tooltip.style.display === 'block' && tooltip.textContent === (abbr.title || '')) {
			hideTooltip();
			return;
		}
		showTooltipFor(abbr);
	});

	// 터치 전용 빠른 반응 보장 (일부 모바일 브라우저가 hover를 발생시키지 않음)
	function __onTouchStartForGlossary(e) {
		const abbr = e.target.closest && e.target.closest('.glossary-abbr');
		if (!abbr) return;
		// preventDefault required to avoid native behaviors (예: 페이지 스크롤) when tapping
		if (typeof e.preventDefault === 'function') {
			e.preventDefault();
		}
		if (typeof e.stopPropagation === 'function') {
			e.stopPropagation();
		}
		showTooltipFor(abbr);
	}

	// register touch listener as non-passive so preventDefault() is allowed
	document.addEventListener('touchstart', __onTouchStartForGlossary, { passive: false });

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
