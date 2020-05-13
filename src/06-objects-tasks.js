/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const params = JSON.parse(json);
  function NewObj() {
    Object.keys(params).forEach((prop) => {
      this[prop] = params[prop];
    });
  }
  NewObj.prototype = proto;
  return new NewObj();
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class CssSelector {
  constructor(obj, currentOrder) {
    this.config = {
      element: null,
      id: null,
      class: [],
      attr: [],
      pseudoClass: [],
      pseudoElement: null,
    };

    this.currentOrder = currentOrder;

    Object.entries(obj).forEach(([key, value]) => {
      if (['class', 'attr', 'pseudoClass'].includes(key)) {
        this.config[key].push(value);
      } else {
        this.config[key] = value;
      }
    });
  }

  element(value) {
    if (this.config.element) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    const order = 0;
    if (order < this.currentOrder) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.config.element = value;
    this.currentOrder = 0;
    return this;
  }

  id(value) {
    if (this.config.id) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }

    const order = 1;
    if (order < this.currentOrder) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.config.id = value;
    this.currentOrder = 1;
    return this;
  }

  class(value) {
    const order = 2;
    if (order < this.currentOrder) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.config.class.push(value);
    this.currentOrder = 2;
    return this;
  }

  attr(value) {
    const order = 3;
    if (order < this.currentOrder) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.config.attr.push(value);
    this.currentOrder = 3;
    return this;
  }

  pseudoClass(value) {
    const order = 4;
    if (order < this.currentOrder) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.config.pseudoClass.push(value);
    this.currentOrder = 4;
    return this;
  }

  pseudoElement(value) {
    if (this.config.pseudoElement) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    const order = 5;
    if (order < this.currentOrder) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.config.pseudoElement = value;
    this.currentOrder = 5;
    return this;
  }

  stringify() {
    let result = '';

    if (this.config.element) {
      result += this.config.element;
    }

    if (this.config.id) {
      result += `#${this.config.id}`;
    }

    if (this.config.class.length !== 0) {
      this.config.class.forEach(((cssCl) => {
        result += `.${cssCl}`;
        return true;
      }));
    }

    if (this.config.attr.length !== 0) {
      this.config.attr.forEach(((att) => {
        result += `[${att}]`;
        return true;
      }));
    }

    if (this.config.pseudoClass.length !== 0) {
      this.config.pseudoClass.forEach(((pseudoCl) => {
        result += `:${pseudoCl}`;
        return true;
      }));
    }

    if (this.config.pseudoElement) {
      result += `::${this.config.pseudoElement}`;
    }
    return result;
  }
}

const cssSelectorBuilder = {
  res: [],

  element(value) {
    return new CssSelector({ element: value }, 0);
  },

  id(value) {
    return new CssSelector({ id: value }, 1);
  },

  class(value) {
    return new CssSelector({ class: value }, 2);
  },

  attr(value) {
    return new CssSelector({ attr: value }, 3);
  },

  pseudoClass(value) {
    return new CssSelector({ pseudoClass: value }, 4);
  },

  pseudoElement(value) {
    return new CssSelector({ pseudoElement: value }, 5);
  },

  combine(selector1, combinator, selector2) {
    let result = '';
    result += selector1.stringify();
    result += ` ${combinator} `;
    result += selector2.stringify();

    this.res.push(result);
    return this;
  },

  stringify() {
    let result = '';
    while (this.res.length > 0) {
      result += this.res.pop();
    }
    return result;
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
