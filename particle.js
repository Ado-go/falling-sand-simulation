class Particle {
  static replaceParticle = new Particle("AIR", "grey", 0, null, Infinity);
  static defaultTraits = new Traits(0, 0);

  constructor(
    type,
    color,
    level,
    physic,
    traits = null,
    effect = null,
    replace = null,
    lifeTime = Infinity
  ) {
    this.type = type;
    this.color = color;
    this.physic = physic;
    this.level = level;
    this.lifeTime = lifeTime;
    this.lifeTimeUpdate = true;
    this.replace = replace ? replace : Particle.replaceParticle;
    this.updated = true;
    this.leftDirection = Math.random() < 0.5;
    this.traits = traits ? traits : Particle.defaultTraits;
    this.effect = effect;
  }

  changeParticle(newParticle) {
    this.type = newParticle.type;
    this.color = newParticle.color;
    this.level = newParticle.level;
    this.physic = newParticle.physic;
    this.lifeTime = newParticle.lifeTime;
    this.replace = newParticle.replace;
    this.traits = newParticle.traits;
    this.effect = newParticle.effect;
  }
}
