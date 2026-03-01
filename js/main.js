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

    // Participating Works Load More Logic
    const heroWorksList = document.getElementById('heroWorksList');
    const btnLoadMoreWorks = document.getElementById('btnLoadMoreWorks');

    if (heroWorksList && btnLoadMoreWorks) {
        const worksData = [
            'img38.jpeg', 'img39.jpeg', 'img40.jpeg', 'img41.jpeg', 'img42.jpeg', 'img43.jpeg',
            // 향후 여기에 새로운 작품 이미지 파일명을 추가하세요 (예: 'img44.jpeg', 'img45.jpeg' ...)
        ];

        let currentDisplayCount = 0;
        const itemsPerLoad = 6;

        function loadMoreWorks() {
            const nextItems = worksData.slice(currentDisplayCount, currentDisplayCount + itemsPerLoad);
            
            nextItems.forEach(filename => {
                const img = document.createElement('img');
                img.src = `assets/images/참여작품/${filename}`;
                img.alt = '참여작품';
                img.loading = 'lazy';
                heroWorksList.appendChild(img);
            });

            currentDisplayCount += nextItems.length;

            // 모든 이미지를 다 보여줬으면 버튼 숨기기
            if (currentDisplayCount >= worksData.length) {
                btnLoadMoreWorks.style.display = 'none';
            }
        }

        // 초기 6개 로드
        loadMoreWorks();

        btnLoadMoreWorks.addEventListener('click', () => {
            loadMoreWorks();
        });
    }

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
            { category: '부대시설', files: ['분장실1.jpeg', '분장실2.jpeg', '회의공간1.jpeg', '회의공간2.jpeg', '조리공간.jpeg', '식당.jpeg', '샤워실.jpeg', '냉난방기.jpeg', '엘리베이터.jpeg', '화장실.jpeg', '흡연실.jpeg'] }
        ];

        const formatTitle = (filename) => {
            return filename.split('.')[0];
        };

        galleryData.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'gallery-section fade-up';
            sectionDiv.setAttribute('data-category', section.category);

            const title = document.createElement('h3');
            title.className = 'gallery-category-title';
            title.textContent = section.category;
            sectionDiv.appendChild(title);

            if (section.category === '부대시설') {
                const mainViewDiv = document.createElement('div');
                mainViewDiv.className = 'gallery-main-view';

                const mainTitleLabel = document.createElement('div');
                mainTitleLabel.className = 'gallery-item-title';
                mainTitleLabel.textContent = formatTitle(section.files[0]);
                mainViewDiv.appendChild(mainTitleLabel);

                const mainImg = document.createElement('img');
                mainImg.src = `assets/images/${section.category}/${section.files[0]}`;
                mainImg.alt = `${section.category} 메인 이미지`;
                mainViewDiv.appendChild(mainImg);

                // 이전/다음 내비게이션 버튼 추가
                const prevBtn = document.createElement('button');
                prevBtn.className = 'nav-btn prev';
                prevBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"></path></svg>';
                
                const nextBtn = document.createElement('button');
                nextBtn.className = 'nav-btn next';
                nextBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"></path></svg>';

                mainViewDiv.appendChild(prevBtn);
                mainViewDiv.appendChild(nextBtn);

                sectionDiv.appendChild(mainViewDiv);

                const thumbContainer = document.createElement('div');
                thumbContainer.className = 'gallery-thumbnails';

                let currentIndex = 0;
                let autoPlayTimer;

                const updateMainView = (index) => {
                    currentIndex = index;
                    const filename = section.files[currentIndex];
                    
                    // 이미지 및 라벨 업데이트
                    mainImg.src = `assets/images/${section.category}/${filename}`;
                    mainTitleLabel.textContent = formatTitle(filename);
                    
                    // 썸네일 활성 상태 업데이트
                    const thumbs = thumbContainer.querySelectorAll('.gallery-thumb');
                    thumbs.forEach((t, i) => {
                        if (i === currentIndex) {
                            t.classList.add('active');
                            
                            // 부모 컨테이너 내부에서만 스크롤 이동 (페이지 점프 방지)
                            const containerWidth = thumbContainer.clientWidth;
                            const thumbWidth = t.clientWidth;
                            const thumbLeft = t.offsetLeft;
                            
                            // 썸네일이 컨테이너의 중앙에 오도록 계산
                            const targetScroll = thumbLeft - (containerWidth / 2) + (thumbWidth / 2);
                            
                            thumbContainer.scrollTo({
                                left: targetScroll,
                                behavior: 'smooth'
                            });
                        } else {
                            t.classList.remove('active');
                        }
                    });
                };

                const startAutoPlay = () => {
                    stopAutoPlay(); // 기존 타이머가 있다면 제거
                    autoPlayTimer = setInterval(() => {
                        const nextIndex = (currentIndex + 1) % section.files.length;
                        updateMainView(nextIndex);
                    }, 4000); // 4초 간격
                };

                const stopAutoPlay = () => {
                    if (autoPlayTimer) clearInterval(autoPlayTimer);
                };

                // 버튼 이벤트 리스너
                prevBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const prevIndex = (currentIndex - 1 + section.files.length) % section.files.length;
                    updateMainView(prevIndex);
                    startAutoPlay();
                });

                nextBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const nextIndex = (currentIndex + 1) % section.files.length;
                    updateMainView(nextIndex);
                    startAutoPlay();
                });

                section.files.forEach((filename, index) => {
                    const thumbDiv = document.createElement('div');
                    thumbDiv.className = `gallery-thumb ${index === 0 ? 'active' : ''}`;
                    const thumbImg = document.createElement('img');
                    thumbImg.src = `assets/images/${section.category}/${filename}`;
                    thumbImg.alt = `${section.category} 썸네일`;
                    thumbImg.loading = 'lazy';

                    thumbDiv.appendChild(thumbImg);
                    thumbContainer.appendChild(thumbDiv);

                    thumbDiv.addEventListener('click', () => {
                        updateMainView(index);
                        startAutoPlay(); // 클릭 시 타이머 재시작 (사용자 경험 배려)
                    });
                });

                sectionDiv.appendChild(thumbContainer);
                
                // 마우스가 올라가면 멈추고, 나가면 다시 시작
                mainViewDiv.addEventListener('mouseenter', stopAutoPlay);
                mainViewDiv.addEventListener('mouseleave', startAutoPlay);
                
                // 초기 자동 재생 시작
                startAutoPlay();
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

        setTimeout(() => {
            document.querySelectorAll('.gallery-categories .fade-up').forEach(el => observer.observe(el));
        }, 100);
    }

    // Naver Map Initialization
    const initMap = () => {
        const mapContainer = document.querySelector('.map-container');
        // naver 객체가 없으면 실행하지 않음 (HTML의 원래 placeholder가 노출됨)
        if (!mapContainer || typeof naver === 'undefined' || !naver.maps) return;

        // 지도를 넣을 div 생성 및 기존 내용 대체
        mapContainer.innerHTML = '<div id="map" style="width:100%; height:100%; min-height:400px; border-radius:8px;"></div>';

        // Studio Coordinates
        const studioLocation = new naver.maps.LatLng(37.179303, 127.335625);

        const mapOptions = {
            center: studioLocation,
            zoom: 15,
            minZoom: 8,
            mapTypeControl: false,
            zoomControl: true,
            zoomControlOptions: {
                position: naver.maps.Position.TOP_RIGHT
            }
        };

        const map = new naver.maps.Map('map', mapOptions);

        // Add Marker
        const marker = new naver.maps.Marker({
            position: studioLocation,
            map: map,
            animation: naver.maps.Animation.DROP,
            title: '그린테라 스튜디오 503'
        });

        // Add InfoWindow
        const contentString = [
            '<div style="padding:15px; min-width:220px; line-height:1.5; font-family:\'Noto Sans KR\', sans-serif;">',
            '   <h4 style="margin:0 0 8px 0; color:#35b88f; font-size:16px; font-weight:700;">그린테라 스튜디오 503</h4>',
            '   <p style="margin:0 0 12px 0; font-size:13px; color:#666;">경기도 용인시 처인구 원삼면 가재월리 503-2</p>',
            '   <a href="https://map.naver.com/p/entry/place/1538990984" target="_blank" style="display:inline-block; padding:6px 12px; background-color:#03c75a; color:#fff; font-size:12px; font-weight:500; text-decoration:none; border-radius:4px;">네이버 지도에서 보기</a>',
            '</div>'
        ].join('');

        const infowindow = new naver.maps.InfoWindow({
            content: contentString,
            maxWidth: 300,
            backgroundColor: "#fff",
            borderColor: "#03c75a",
            borderWidth: 2,
            anchorSize: new naver.maps.Size(10, 10),
            anchorSkew: true,
            anchorColor: "#fff",
            pixelOffset: new naver.maps.Point(0, -5)
        });

        // Open InfoWindow on marker click
        naver.maps.Event.addListener(marker, "click", function(e) {
            if (infowindow.getMap()) {
                infowindow.close();
            } else {
                infowindow.open(map, marker);
            }
        });

        // Open InfoWindow initially
        infowindow.open(map, marker);
    };

    // Load Map after a short delay to ensure everything is ready
    if (typeof naver !== 'undefined') {
        naver.maps.onJSContentLoaded = initMap;
    } else {
        // Fallback for script loading issues
        setTimeout(initMap, 1000);
    }
});
