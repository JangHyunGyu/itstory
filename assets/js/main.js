(() => {
	const navLinks = Array.from(document.querySelectorAll('.page__nav a'));
	const languageSelects = Array.from(document.querySelectorAll('[data-language-switch]'));
	const LANGUAGE_STORAGE_KEY = 'archerlab:language';

	const normalizeLanguage = (value) => {
		if (!value || typeof value !== 'string') {
			return null;
		}
		const lowered = value.toLowerCase();
		if (lowered.startsWith('ko')) {
			return 'ko';
		}
		if (lowered.startsWith('en')) {
			return 'en';
		}
		return 'en';
	};

	const getStoredLanguage = () => {
		try {
			return localStorage.getItem(LANGUAGE_STORAGE_KEY);
		} catch (error) {
			return null;
		}
	};

	const setStoredLanguage = (code) => {
		if (!code) {
			return;
		}
		try {
			localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
		} catch (error) {
			// 저장이 불가능한 환경에서는 조용히 무시합니다.
		}
	};

	const detectBrowserLanguage = () => {
		const candidate = Array.isArray(navigator.languages) && navigator.languages.length
			? navigator.languages[0]
			: navigator.language || navigator.userLanguage || '';
		return normalizeLanguage(candidate);
	};

	const findOptionByLanguage = (select, languageCode) => {
		if (!select || !languageCode) {
			return null;
		}
		return (
			Array.from(select.options || []).find((option) =>
				normalizeLanguage(option.dataset?.languageCode || option.value) === languageCode
			) || null
		);
	};

	const getSelectedOption = (select) => {
		if (!select) {
			return null;
		}
		if (select.selectedOptions && select.selectedOptions.length) {
			return select.selectedOptions[0];
		}
		const index = typeof select.selectedIndex === 'number' ? select.selectedIndex : -1;
		if (index < 0 || !select.options || !select.options.length) {
			return null;
		}
		return select.options[index] || null;
	};

	const currentDocumentLanguage = normalizeLanguage(document.documentElement?.lang || '');
	const storedLanguage = normalizeLanguage(getStoredLanguage());
	const browserLanguage = detectBrowserLanguage();
	const preferredLanguage = storedLanguage || browserLanguage;
	const shouldAttemptRedirect =
		!storedLanguage && preferredLanguage && currentDocumentLanguage && preferredLanguage !== currentDocumentLanguage;

	const languageLinkTargets = {
		main: {
			ko: 'https://archerlab.dev',
			en: 'https://archerlab.dev/index-en.html'
		}
	};

	const resolveActiveLanguage = () =>
		currentDocumentLanguage || normalizeLanguage(getStoredLanguage()) || 'ko';

	const syncLanguageAwareLinks = () => {
		const activeLanguage = resolveActiveLanguage();
		const candidates = new Set();
		const annotatedNodes = document.querySelectorAll('[data-language-link][data-link-key]');
		annotatedNodes.forEach((node) => candidates.add(node));
		const fallbackNodes = document.querySelectorAll('a[href^="https://archerlab.dev"]');
		fallbackNodes.forEach((node) => candidates.add(node));
		if (!candidates.size) {
			return;
		}
		candidates.forEach((node) => {
			const key = node.dataset?.linkKey || 'main';
			const targets = languageLinkTargets[key] || languageLinkTargets.main;
			if (!targets) {
				return;
			}
			const href = targets[activeLanguage] || targets.en || targets.ko;
			if (href) {
				node.setAttribute('href', href);
			}
		});
	};

	syncLanguageAwareLinks();

	languageSelects.forEach((select) => {
		const optionForCurrent = findOptionByLanguage(select, currentDocumentLanguage);
		if (optionForCurrent) {
			select.value = optionForCurrent.value;
		}
	});

	if (shouldAttemptRedirect) {
		const redirectSelect = languageSelects[0] || null;
		const redirectOption = findOptionByLanguage(redirectSelect, preferredLanguage);
		if (redirectOption) {
			setStoredLanguage(preferredLanguage);
			window.location.replace(redirectOption.value);
			return;
		}
	}

	if (!storedLanguage && currentDocumentLanguage) {
		setStoredLanguage(currentDocumentLanguage);
	}

	languageSelects.forEach((select) => {
		select.addEventListener('change', (event) => {
			const target = event.target;
			const destination = target?.value;
			const selectedOption = getSelectedOption(target);
			const selectedLanguageCode = normalizeLanguage(
				selectedOption?.dataset?.languageCode || selectedOption?.value || ''
			);
			if (selectedLanguageCode) {
				setStoredLanguage(selectedLanguageCode);
			}
			if (!destination) {
				return;
			}
			window.location.href = destination;
		});
	});

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
	const timelineRoot = document.querySelector('.timeline-grid');
	const eventButtons = timelineRoot ? Array.from(timelineRoot.querySelectorAll('[data-event-id]')) : [];

	const buildTimelineArchive = () => {
		if (!eventButtons.length || !timelineRoot) {
			return;
		}
		const language = currentDocumentLanguage === 'en' ? 'en' : 'ko';
		const messages = {
			ko: {
				title: '이야기 텍스트로 모두 읽기',
				intro:
					'각 연도의 이야기를 접거나 펼쳐서 순서대로 읽을 수 있는 텍스트 버전입니다. 검색엔진과 보조공학에서도 전체 내용을 곧바로 확인할 수 있어요.'
			},
			en: {
				title: 'Read Every Story As Text',
				intro:
					'This section lists every timeline story in collapsible text so search engines and assistive tech can access the full content without opening modals.'
			}
		};
		const labels = messages[language];
		const archiveSection = document.createElement('section');
		archiveSection.classList.add('timeline-archive', 'is-visually-hidden');
		archiveSection.setAttribute('data-event-archive', '');
		const heading = document.createElement('h2');
		heading.className = 'timeline-archive__title';
		heading.textContent = labels.title;
		const intro = document.createElement('p');
		intro.className = 'timeline-archive__intro';
		intro.textContent = labels.intro;
		archiveSection.append(heading, intro);
		const listContainer = document.createElement('div');
		listContainer.className = 'timeline-archive__list';
		archiveSection.appendChild(listContainer);
		eventButtons.forEach((button, index) => {
			const eventId = button.dataset?.eventId;
			if (!eventId) {
				return;
			}
			const template = document.getElementById(`event-${eventId}`);
			if (!template) {
				return;
			}
			const details = document.createElement('details');
			details.className = 'timeline-archive__item';
			if (index === 0) {
				details.open = true;
			}
			const summary = document.createElement('summary');
			summary.className = 'timeline-archive__summary';
			const yearText = button.querySelector('.timeline-event__year')?.textContent?.trim();
			const labelText = button.querySelector('.timeline-event__label')?.textContent?.trim();
			summary.textContent = yearText && labelText ? `${yearText} · ${labelText}` : button.textContent.trim();
			details.appendChild(summary);
			const body = document.createElement('div');
			body.className = 'timeline-archive__body';
			const fragment = template.content
				? template.content.cloneNode(true)
				: (() => {
					const fallbackFragment = document.createDocumentFragment();
					Array.from(template.childNodes).forEach((node) => {
						fallbackFragment.appendChild(node.cloneNode(true));
					});
					return fallbackFragment;
				})();
			body.appendChild(fragment);
			details.appendChild(body);
			listContainer.appendChild(details);
		});
		timelineRoot.insertAdjacentElement('afterend', archiveSection);
	};

	const scheduleArchiveBuild = () => {
		if (!eventButtons.length || !timelineRoot) {
			return;
		}
		const run = () => buildTimelineArchive();
		if (typeof window.requestIdleCallback === 'function') {
			window.requestIdleCallback(run, { timeout: 1200 });
		} else {
			setTimeout(run, 200);
		}
	};

	scheduleArchiveBuild();
	const FOCUSABLE_SELECTOR =
		'a[href], button:not([disabled]), textarea, input, select, summary, details, [tabindex]:not([tabindex="-1"])';
	let lastFocusedTrigger = null;
	let focusableElements = [];
	const pageScrollTopButtons = Array.from(document.querySelectorAll('[data-scroll-top]'));
	let modalScrollButton = null;
	let modalScrollHandler = null;
	let modalScrollTicking = false;
	// 타임라인 페이지에서 내비게이션, 모달, 용어집 툴팁을 제어하는 즉시 실행 함수입니다.
	let firstFocusable = null;
		// 헤더 내비게이션 링크 목록과 각 섹션을 매핑합니다.
	let lastFocusable = null;

	if (!modal || !modalWindow || !modalContent) {
		// 현재 보고 있는 섹션에 맞춰 내비게이션에 강조 표시를 붙입니다.
		return;
	}

	const hidePageScrollTop = () => {
		if (!pageScrollTopButtons.length) {
			return;
		}
		pageScrollTopButtons.forEach((button) => button.setAttribute('hidden', ''));
	};

	const requestPageScrollUpdate = () => {
		window.dispatchEvent(new Event('scroll'));
	};

	const updateModalScrollButtonVisibility = () => {
		if (!modalScrollButton) {
			return;
		}
		const shouldShow = modalContent && modalContent.scrollTop > 180;
		const isHidden = modalScrollButton.hasAttribute('hidden');
		if (shouldShow && isHidden) {
			modalScrollButton.removeAttribute('hidden');
		} else if (!shouldShow && !isHidden) {
			modalScrollButton.setAttribute('hidden', '');
		}
	};

	const detachModalScrollHandler = () => {
		if (modalContent && modalScrollHandler) {
			modalContent.removeEventListener('scroll', modalScrollHandler);
		}
		modalScrollHandler = null;
		modalScrollTicking = false;
	};

	const attachModalScrollHandler = () => {
		if (!modalWindow || !modalContent) {
			return;
		}
		const hasVerticalOverflow = modalContent.scrollHeight - modalContent.clientHeight > 2;
		if (!hasVerticalOverflow) {
			detachModalScrollHandler();
			if (modalScrollButton) {
				modalScrollButton.setAttribute('hidden', '');
			}
			return;
		}
		if (!modalScrollButton) {
			modalScrollButton = document.createElement('button');
			modalScrollButton.type = 'button';
			modalScrollButton.className = 'modal-scroll-top';
			modalScrollButton.setAttribute('aria-label', '이야기 맨 위로 이동');
			modalScrollButton.textContent = '↑';
			modalScrollButton.setAttribute('hidden', '');
			modalScrollButton.addEventListener('click', (event) => {
				event.preventDefault();
				if (typeof modalContent.scrollTo === 'function') {
					modalContent.scrollTo({ top: 0, behavior: 'smooth' });
				} else {
					modalContent.scrollTop = 0;
				}
			});
		}
		if (!modalScrollButton.isConnected) {
			modalWindow.appendChild(modalScrollButton);
		}
		detachModalScrollHandler();
		modalScrollHandler = () => {
			if (modalScrollTicking) {
				return;
			}
			modalScrollTicking = true;
			requestAnimationFrame(() => {
				updateModalScrollButtonVisibility();
				modalScrollTicking = false;
			});
		};
		modalContent.addEventListener('scroll', modalScrollHandler, { passive: true });
		updateModalScrollButtonVisibility();
	};

	const resetModalScroll = () => {
		if (modalContent) {
			if (typeof modalContent.scrollTo === 'function') {
				modalContent.scrollTo({ top: 0, left: 0, behavior: 'instant' });
			} else {
				modalContent.scrollTop = 0;
				modalContent.scrollLeft = 0;
			}
		}
		if (modalWindow) {
			if (typeof modalWindow.scrollTo === 'function') {
				modalWindow.scrollTo({ top: 0, left: 0, behavior: 'instant' });
			} else {
				modalWindow.scrollTop = 0;
				modalWindow.scrollLeft = 0;
			}
		}
	};

	const resetModalScrollDeferred = () => {
		resetModalScroll();
		requestAnimationFrame(resetModalScroll);
		setTimeout(resetModalScroll, 0);
	};

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
		resetModalScrollDeferred();
		detachModalScrollHandler();
		if (modalScrollButton) {
			modalScrollButton.setAttribute('hidden', '');
		}
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
		requestPageScrollUpdate();
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
		resetModalScrollDeferred();
		modalContent.appendChild(template.content.cloneNode(true));
		modal.hidden = false;
		document.body.classList.add('is-modal-open');
		hidePageScrollTop();
		modal.setAttribute('aria-labelledby', `event-${eventId}-title`);
		resetModalScrollDeferred();
		setModalFocusables();
		modalWindow.addEventListener('keydown', trapFocusInsideModal);
		if (firstFocusable && typeof firstFocusable.focus === 'function') {
			firstFocusable.focus();
		} else {
			modalWindow.focus();
		}

		// 초보자용 용어 툴팁 적용: 템플릿 내용이 삽입된 직후에 실행
		applyGlossaryTooltips(modalContent);
		attachModalScrollHandler();
	};

	// 간단한 용어집: 전문 용어를 일상어로 풀어쓴 설명
	const GLOSSARY = {
		"Ethernet": "LAN 케이블이라고 부르는 선으로 여러 기기가 차례대로 데이터를 주고받을 수 있게 만든 통신 방법입니다.",
		"TSN": "Time-Sensitive Networking의 줄임말로, 공장 로봇이나 자율주행차처럼 타이밍이 중요한 장비가 끊김 없이 정보를 처리하도록 돕는 이더넷 기능입니다.",
		"IEEE": "전 세계 연구자와 기업이 모여 전기와 전자 제품이 같은 규칙으로 동작하도록 기준을 만드는 국제 단체입니다.",
		"프레임": "네트워크에서 한 번에 보내는 데이터 꾸러미입니다. 편지 봉투 하나에 주소와 내용을 담아 보내는 것과 비슷합니다.",
		"지터": "동영상이나 통화가 끊길 때 느끼는 들쭉날쭉한 지연입니다. 데이터가 제시간에 도착하지 못해 생기는 시간 차이를 말합니다."
	};

	const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const GLOSSARY_PATTERN = Object.keys(GLOSSARY).map(escapeRegExp).join("|");
	const GLOSSARY_REGEX_SOURCE = GLOSSARY_PATTERN ? `\\b(${GLOSSARY_PATTERN})\\b` : '';
	const buildGlossaryRegex = () => (GLOSSARY_REGEX_SOURCE ? new RegExp(GLOSSARY_REGEX_SOURCE, 'g') : null);

	function applyGlossaryTooltips(root) {
		if (!root) return;
		const re = buildGlossaryRegex();
		if (!re) return;

		// 텍스트 노드만 순회하며 치환
		const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
		const nodes = [];
		while (walker.nextNode()) nodes.push(walker.currentNode);

		nodes.forEach((textNode) => {
			const parent = textNode.parentNode;
			if (!parent || parent.closest('abbr')) return; // 이미 감싸진 경우 스킵
			const text = textNode.nodeValue;
			re.lastIndex = 0;
			if (!re.test(text)) return;
			re.lastIndex = 0;
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

	if (timelineRoot) {
		timelineRoot.addEventListener('click', (event) => {
			const trigger = event.target && event.target.closest('[data-event-id]');
			if (!trigger) {
				return;
			}
			openModal(trigger);
		});
	}

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

	(() => {
		const scrollTopButtons = Array.from(document.querySelectorAll('[data-scroll-top]'));
		if (!scrollTopButtons.length) {
			return;
		}

		const hideAll = () => {
			scrollTopButtons.forEach((button) => button.setAttribute('hidden', ''));
		};

		const showAll = () => {
			scrollTopButtons.forEach((button) => button.removeAttribute('hidden'));
		};

		const toggleScrollTop = () => {
			if (document.body.classList.contains('is-modal-open')) {
				hideAll();
				return;
			}
			const shouldShow = window.scrollY > 320;
			if (shouldShow) {
				showAll();
			} else {
				hideAll();
			}
		};

		let ticking = false;
		const onScroll = () => {
			if (ticking) {
				return;
			}
			ticking = true;
			requestAnimationFrame(() => {
				toggleScrollTop();
				ticking = false;
			});
		};

		toggleScrollTop();
		window.addEventListener('scroll', onScroll, { passive: true });
		scrollTopButtons.forEach((button) => {
			button.addEventListener('click', (event) => {
				event.preventDefault();
				window.scrollTo({ top: 0, behavior: 'smooth' });
			});
		});
	})();
