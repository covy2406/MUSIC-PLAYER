/**
 * 1. Render songs
 * 2. Scroll top
 * 3. play the song/ paused / seek
 * 4. cd rotation
 * 5. next song / prev song
 * 6. random
 * 7. next / repeat when  end of song
 * 8. active song
 * 9. scroll active song into view
 * 10. Play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'MUSIC_PLAYER'

const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress')
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');
const Timeduration = $('.Timeduration');
const Timeleft = $('.Timeleft');

// this ở đây là app
const app = {
    // lấy ra bài hát hiện tại
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    progressSong: 0,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    songs: [
        {
            name: 'Nho ma khong the noi',
            singer: 'Thoi Tu Cach',
            path: './assets/music/Nho-Ma-Khong-The-Noi-Thoi-Tu-Cach.mp3',
            image: './assets/image/Kim-seon-ho.jpg',
        },
        {
            name: 'Breath',
            singer: 'Sam Kim',
            path: './assets/music/Breath-Sam-Kim.mp3',
            image: './assets/image/suzy-long-hair.jpg',
        },
        {
            name: 'Ending Scene',
            singer: 'IU',
            path: './assets/music/Ending-Scene-IU.mp3',
            image: './assets/image/IU.jpg',
        },
        {
            name: 'Say you do',
            singer: 'Tien Tien',
            path: './assets/music/Say-You-Do-Tien-Tien.mp3',
            image: './assets/image/cape_suzy.jpg',
        },
        {
            name: 'If it is you',
            singer: 'Rosie',
            path: './assets/music/If-It-Is-You-Rose-BLACKPINK.mp3',
            image: './assets/image/Rosie.jpg',
        },
        {
            name: 'Bad Boy',
            singer: 'RedVelvet',
            path: './assets/music/Bad-Boy-Red-Velvet.mp3',
            image: './assets/image/seon-ho-hometown.jpg',
        },

        {
            name: 'Tinh yeu cham tre',
            singer: 'Monstar',
            path: './assets/music/tinh-yeu-cham-tre-MONSTAR.mp3',
            image: './assets/image/seon-ho-cute.jpg',
        }
    ],

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
          </div>
            `
        });
        playlist.innerHTML = htmls.join('')
    },

    // hàm get bài hát ra khi chọn bài để show ra
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },

    // HÀM XỬ LÝ KHI SCROLL(KÉO CẢ MÀN HÌNH LÊN XUỐNG)
    // THÌ ẢNH HIỂN THỊ AVARTAR CỦA BÀI HÁT ĐANG PHÁT NHỎ DẦN
    // VÀ MẤT ĐI VÀ MỜ DẦN
    handleEvents: function() {
        
        const cdWidth = cd.offsetWidth
        const _this = this

        // Xử lý phóng to or thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            //console.log(newCdWidth)
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth // opacity
        }

        // Xử lý khi click play để bật nhạc
        //console.log(playBtn)

        playBtn.onclick = function() {
            audio.play();

            if(_this.isPlaying) {
                audio.pause();
            }
            else {
                audio.play();
            }
        }

        // Khi song được play
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing')
            cdThumbAnimate.play();
        }

        // khi song bị pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // Khi tiến độ bài hát thay đổi
        
        audio.ontimeupdate = function() {
            if(audio.duration != NaN) {
                const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
                progress.value = progressPercent;
                Timeleft.innerHTML = _this.formatTime(audio.currentTime); // thời gian đếm từng giây của bài hát từ 0 -> hết.
                progress.setAttribute('title', _this.currentTime); // đưa mốc song về đầu progress

            }
            //console.log((audio.currentTime / audio.duration) * 100)
        }

        // Xử lý khi tua
        progress.onchange = function(e) {
            const seekTime = (audio.duration / 100) * e.target.value
            audio.currentTime = seekTime
            //console.log(seekTime)
        }

        progress.addEventListener("mousemove", (e) => {
            const progressWidth = progress.offsetWidth;
            const mouseX = e.clientX - progressWidth.getBoundingClientRect().left;
            const percentage = mouseX / progressWidth;
            
            cursor.style.left = mouseX + 'px';

            console.log('time: ${minutes}:${seconds}');
        })

        // Xử lý quay CD và dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000, // 10s
            iterations: Infinity, // quay vô hạn
        })
        cdThumbAnimate.pause();

        // Xử lý next song
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            }
            else {
                _this.nextSong();
            }
            
            audio.play();
            _this.render(); // bài hát phát đến bài nào thì menu
            // bài hát phát sáng bài đó.
            _this.scrollToActiveSong();
        }

        // Xử lý prev Song
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            }
            else {
                _this.prevSong();
            }
            
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // Xử lý Random bài hát ngẫu nhiên: nghĩa là khi tua tới or lui thì
        // show ra bài hát bất kỳ ko theo thứ tự.
        // XỬ LÝ RANDOM: BẬT / TẮT RANDOM.
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle("active", _this.isRandom);
            // khi class vào thì thêm class active nếu chưa có,
            // còn nếu có class active rồi thì xóa đi
        }

        // XỬ LÝ REPEAT LẶP LẠI MỘT BÀI HÁT
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle("active", _this.isRepeat);
        }

        // XỬ LÝ NEXT SONG KHI AUDIO ENDED
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play();
            }
            else {
                nextBtn.click();
            }
        }

        // KÍCH VÀO BÀI HÁT NÀO Ở LIST BÊN DƯỚI THÌ PHÁT BÀI ĐÓ
        playlist.onclick = function(e) {
            //console.log(e.target.value);

            const songNode = e.target.closest('.song:not(.active)');

            // XỬ LÝ KHI CLICK VÀO SONG CHUYỂN ĐẾN BÀI ĐÓ
            if(songNode || e.target.closest('.option')){
                //console.log(e.target);
                //console.log(songNode.dataset.index); // songNode.getAttribute('data-index');
                _this.currentIndex = Number(songNode.dataset.index); // tại đây khi getAttribute
                // thì giá trị index lấy ra là chuỗi nên conver sang number
                _this.loadCurrentSong();
                audio.play();
                _this.render();
                _this.progressSong = 0;
            }

            // XỬ LÝ KHI CLICK VÀO OPTION CỦA SONG
            if(e.target.closest('.option')) {

            }

        }
        
    },

    // Khi chọn đến bài hát nào thì bài hát đó chạy lên trên
    // ví dụ bài list bài hát dài và bài hát bị ẩn do vượt quá
    // màn hình lap, thì nó sẽ kéo bài hát lên trên để thấy
    scrollToActiveSong: function() {
        const songView = $$('.song');
        var view = ''
        if(this.currentIndex < 3) {
            view = 'end'
        }
        else {
            view = 'center'
        }
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: view
            })
        }, 300)
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
        // TÍNH TỔNG THỜI GIAN CỦA MỖI SONG TRÊN TRỤC SONG
        audio.onloadedmetadata = () => {
            Timeduration.innerHTML = this.formatTime(audio.duration);
            audio.currentTime = this.progressSong
        }
    
        //console.log(heading, cdThumb, audio);
    },

    // ĐỊNH NGHĨA TIME VỀ PHÚT VÀ GIÂY TRÊN TRỤC TIME CỦA SONG
    formatTime: function(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        const formattedTime = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
        return formattedTime;
    },

    // LOAD CONFIG
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    // Khi next bài hát đến bài hát tiếp theo
    nextSong: function() {
        this.currentIndex++;
        this.progressSong = 0;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
            // khi mà đã phát đến bài hát cuối cùng mà bấm next
            // thì sẽ quay về bài hát đầu tiên
        }
        this.loadCurrentSong();
    },

    // Khi lui bài hát
    prevSong: function() {
        this.currentIndex--;
        this.progressSong = 0;
        if(this.currentIndex <= 0) {
            this.currentIndex = this.songs.length - 1;
            // Khi mà quay về bài trước đó thì bài muốn luôi lại
            // (tức là bài hiện tại đã lui được rồi) = chiều dài
            // của chuỗi bài hát trừ cho 1
        }
        this.loadCurrentSong();
    },

    // Hàm random
    playRandomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex) 
        // do-while: chạy ít nhất 1 lần dù đúng hay sai

        this.currentIndex = newIndex;
        this.progressSong = 0;
        this.loadCurrentSong();
    },

    start: function () {
        // GÁN CẤU HÌNH TỪ CONFIG VÀO ỨNG DỤNG
        this.loadConfig();

        // lắng nghe và xử lý các xự kiện trong dom
        this.handleEvents()

        // định nghĩa các thuộc tính cho object
        this.defineProperties()

        // tải thông tin bài hát đầu tiên vào UI khi chạy
        // ứng dụng
        this.loadCurrentSong()

        // Bài hát tiếp theo
        this.nextSong();

        // Bài hát trước đó
        this.prevSong();

        // Hiển thị trạng thái ban đầu của button random
        randomBtn.classList.toggle("active", this.isRandom);

        // Hiển thị trạng thái ban đầu của button Repeate
        repeatBtn.classList.toggle("active", this.isRepeat);

        // render playlist
        this.render();
    }
};

app.start();