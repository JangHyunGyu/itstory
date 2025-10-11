
(() => {
	const timelineItems = Array.from(document.querySelectorAll('.timeline__item'));
	const navLinks = Array.from(document.querySelectorAll('.page__nav a'));

	const setActiveTimeline = (element) => {
		if (!element) {
			return;
		}
		timelineItems.forEach((item) => item.classList.remove('timeline__item--active'));
		element.classList.add('timeline__item--active');
	};

	if (timelineItems.length) {
		setActiveTimeline(timelineItems[0]);
		if ('IntersectionObserver' in window) {
			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							setActiveTimeline(entry.target);
						}
					});
				},
				{ rootMargin: '-18% 0px -56% 0px', threshold: 0.35 }
			);
			timelineItems.forEach((item) => observer.observe(item));
		}
	}

	const sectionMap = new Map();
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

	const setActiveNav = (link) => {
		navLinks.forEach((item) => item.classList.remove('is-active'));
		if (link) {
			link.classList.add('is-active');
		}
	};

	if (sectionMap.size) {
		setActiveNav(navLinks[0] || null);
		if ('IntersectionObserver' in window) {
			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							const link = sectionMap.get(entry.target);
							setActiveNav(link || null);
						}
					});
				},
				{ rootMargin: '-45% 0px -45% 0px', threshold: 0.25 }
			);
			sectionMap.forEach((_, section) => observer.observe(section));
		}
	}

	navLinks.forEach((link) => {
		link.addEventListener('click', () => {
			setActiveNav(link);
		});
	});
})();
