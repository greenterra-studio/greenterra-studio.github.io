document.addEventListener('DOMContentLoaded', () => {
    // Scroll Header
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }

    // Intersection Observer for setup animations (fade-up)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: unobserve after animating
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-up');
    animatedElements.forEach(el => observer.observe(el));

    // Trigger Hero animations immediately 
    setTimeout(() => {
        document.querySelectorAll('.hero .fade-up').forEach(el => {
            el.classList.add('visible');
        });
    }, 100);

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                }
                const headerHeight = header.offsetHeight;
                window.scrollTo({
                    top: target.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Dynamic Gallery Injection based on new folder structure
    const galleryGrid = document.getElementById('galleryGrid');
    if (galleryGrid) {
        galleryGrid.innerHTML = '';
        galleryGrid.className = 'gallery-categories';

        const galleryData = [
            { category: '외부사진', files: ['img18.jpeg', 'img21.jpeg', 'img24.jpeg'] },
            { category: '내부사진', files: ['img14.jpeg', 'img17.jpeg', 'img27.jpeg', 'img34.jpeg'] },
            { category: '1층도면', files: ['img36.png'] },
            { category: '3층도면', files: ['img37.png'] },
            { category: '편의시설', files: ['간이식당1.jpeg', '간이식당2.jpeg', '대기실1.jpeg', '대기실2.jpeg', '대기실3.jpeg', '샤워실.jpeg', '식당외관.jpeg', '에어컨.jpeg', '엘리베이터.jpeg', '화장실.jpeg', '회의실.jpeg', '흡연장소.jpeg'] }
        ];

        galleryData.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'gallery-section fade-up';
            sectionDiv.setAttribute('data-category', section.category);

            const title = document.createElement('h3');
            title.className = 'gallery-category-title';
            title.textContent = section.category;
            sectionDiv.appendChild(title);

            if (section.category === '편의시설') {
                // Main Viewer for 편의시설
                const mainViewDiv = document.createElement('div');
                mainViewDiv.className = 'gallery-main-view';
                const mainImg = document.createElement('img');
                mainImg.src = `assets/images/${section.category}/${section.files[0]}`;
                mainImg.alt = `${section.category} 메인 이미지`;
                mainViewDiv.appendChild(mainImg);
                sectionDiv.appendChild(mainViewDiv);

                // Thumbnails
                const thumbContainer = document.createElement('div');
                thumbContainer.className = 'gallery-thumbnails';

                section.files.forEach((filename, index) => {
                    const thumbDiv = document.createElement('div');
                    thumbDiv.className = `gallery-thumb ${index === 0 ? 'active' : ''}`;
                    const thumbImg = document.createElement('img');
                    thumbImg.src = `assets/images/${section.category}/${filename}`;
                    thumbImg.alt = `${section.category} 썸네일`;
                    thumbImg.loading = 'lazy';

                    thumbDiv.appendChild(thumbImg);
                    thumbContainer.appendChild(thumbDiv);

                    // Click event to update main viewer
                    thumbDiv.addEventListener('click', () => {
                        mainImg.src = `assets/images/${section.category}/${filename}`;
                        thumbContainer.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
                        thumbDiv.classList.add('active');
                    });
                });

                sectionDiv.appendChild(thumbContainer);
            } else {
                const gridDiv = document.createElement('div');
                gridDiv.className = 'gallery-grid-inner';

                section.files.forEach(filename => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'gallery-item';

                    const img = document.createElement('img');
                    img.src = `assets/images/${section.category}/${filename}`;
                    img.alt = `${section.category} 이미지`;
                    img.loading = 'lazy';

                    itemDiv.appendChild(img);
                    gridDiv.appendChild(itemDiv);
                });

                sectionDiv.appendChild(gridDiv);
            }

            galleryGrid.appendChild(sectionDiv);
        });

        // Setup observer for dynamically generated sections
        setTimeout(() => {
            document.querySelectorAll('.gallery-categories .fade-up').forEach(el => observer.observe(el));
        }, 100);
    }
});
