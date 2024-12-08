export class SoundManager {
  private static instance: SoundManager;
  private bgm: HTMLAudioElement | null = null;
  private sfx: Map<string, HTMLAudioElement> = new Map();
  private isMuted = false;
  private isInitialized = false;
  private bgmVolume = 0.3;
  private sfxVolume = 0.5;

  private constructor() {
    this.initializeAudio();
  }

  private initializeAudio() {
    // BGMの初期設定
    this.bgm = new Audio('/sounds/bgm/main-theme.mp3');
    this.bgm.loop = true;
    this.bgm.volume = this.bgmVolume;
    
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
      audio.volume = this.sfxVolume;
      this.sfx.set(key, audio);
    });
  }

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  // ユーザーインタラクション後に呼び出される初期化メソッド
  async initialize() {
    if (this.isInitialized) return;

    try {
      // モバイルブラウザでの音声再生を有効化するためのダミー再生
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      await context.resume();
      
      // 全ての音声ファイルを一度ロードして準備
      const promises = [this.bgm, ...this.sfx.values()].map(async audio => {
        if (!audio) return;
        try {
          await audio.play();
          audio.pause();
          audio.currentTime = 0;
        } catch (error) {
          console.log('Audio preload failed:', error);
        }
      });
      
      await Promise.all(promises);
      this.isInitialized = true;
      
      if (!this.isMuted) {
        this.playBGM();
      }
    } catch (error) {
      console.error('Audio initialization failed:', error);
    }
  }

  async playBGM() {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    if (!this.isMuted && this.bgm) {
      try {
        await this.bgm.play();
      } catch (error) {
        console.log('BGM playback failed:', error);
      }
    }
  }

  pauseBGM() {
    if (this.bgm) {
      this.bgm.pause();
    }
  }

  async playSFX(name: string) {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    if (!this.isMuted) {
      const sound = this.sfx.get(name);
      if (sound) {
        sound.currentTime = 0;
        try {
          await sound.play();
        } catch (error) {
          console.log('SFX playback failed:', error);
        }
      }
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.pauseBGM();
      this.sfx.forEach(sound => {
        sound.pause();
        sound.currentTime = 0;
      });
    } else {
      this.playBGM();
    }
  }

  // 音量制御メソッドの追加
  setBGMVolume(volume: number) {
    this.bgmVolume = Math.max(0, Math.min(1, volume));
    if (this.bgm) {
      this.bgm.volume = this.bgmVolume;
    }
  }

  setSFXVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    this.sfx.forEach(sound => {
      sound.volume = this.sfxVolume;
    });
  }
}