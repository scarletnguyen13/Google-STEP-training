class IconGenerator {
  constructor(size) {
    this.size = size;
  }
  
  /**
   * @param {Array.string} iconNames
   * @returns {Array.Element} 
   */
  generate(iconNames) {
    const icons = [];
    iconNames.map(name => 
      icons.push(this.createIcon(name))
    );
    return icons;
  }

  /**
   * @param {string} name
   * @returns {Element} 
   */
  createIcon(name) {
    const icon = document.createElement('img');
    icon.src = `../images/icons/${name}-icon.png`;
    icon.className = 'icon';
    icon.style.width = this.size;
    return icon;
  }
}

export { IconGenerator };