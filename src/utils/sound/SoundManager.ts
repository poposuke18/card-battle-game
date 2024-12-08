export class SoundManager {
    private static instance: SoundManager;
    private bgm: HTMLAudioElement | null = null;
    private sfx: Map<string, HTMLAudioElement> = new Map();
    private isMuted = false;

    private bgmVolume = 0.3;  // BGMのデフォルト音量
    private sfxVolume = 0.5;  // 効果音のデフォルト音量
  
    private constructor() {
      // BGMの初期設定
      this.bgm = new Audio('/sounds/bgm/main-theme.mp3');
      this.bgm.loop = true;

      if (this.bgm) {
        this.bgm.volume = this.bgmVolume;
      }
      
      // 効果音の音量設定
      this.sfx.forEach(sound => {
        sound.volume = this.sfxVolume;
      });
      
      // 効果音の初期設定
      const sfxList = {
        'card-place': '/sounds/sfx/card-place.mp3',
        'card-flip': '/sounds/sfx/card-flip.mp3',
        'effect-trigger': '/sounds/sfx/effect.mp3',
        'turn-end': '/sounds/sfx/turn-end.mp3',
        'victory': '/sounds/sfx/victory.mp3',
        'defeat': '/sounds/sfx/defeat.mp3'
      };
  
      Object.entries(sfxList).forEach(([key, path]) => {
        const audio = new Audio(path);
        this.sfx.set(key, audio);
      });
    }
  
    static getInstance(): SoundManager {
      if (!SoundManager.instance) {
        SoundManager.instance = new SoundManager();
      }
      return SoundManager.instance;
    }
  
    playBGM() {
      if (!this.isMuted && this.bgm) {
        // Promiseを返すように修正
        return this.bgm.play().catch(error => {
          console.log('BGM autoplay failed:', error);
          // 自動再生に失敗した場合は静かに失敗
        });
      }
    }
  
    pauseBGM() {
      if (this.bgm) {
        this.bgm.pause();
      }
    }
  
    playSFX(name: string) {
      if (!this.isMuted) {
        const sound = this.sfx.get(name);
        if (sound) {
          sound.currentTime = 0;
          sound.play();
        }
      }
    }
  
    toggleMute() {
      this.isMuted = !this.isMuted;
      if (this.isMuted) {
        this.pauseBGM();
      } else {
        this.playBGM();
      }
    }
  }