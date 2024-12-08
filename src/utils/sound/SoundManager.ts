export class SoundManager {
    private static instance: SoundManager;
    private bgm: HTMLAudioElement | null = null;
    private sfx: Map<string, HTMLAudioElement> = new Map();
    private isMuted = false;
  
    private constructor() {
      // BGMの初期設定
      this.bgm = new Audio('/sounds/bgm/main-theme.mp3');
      this.bgm.loop = true;
      
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
        this.bgm.play();
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