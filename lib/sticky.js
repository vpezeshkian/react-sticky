'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Sticky = function (_React$Component) {
  _inherits(Sticky, _React$Component);

  function Sticky(props) {
    _classCallCheck(this, Sticky);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Sticky).call(this, props));

    _this.onScroll = function () {
      var height = _this.getHeight();
      var pageY = window.pageYOffset;
      var origin = _this.getOrigin(pageY);
      var isSticky = _this.isSticky(pageY, _this.state.origin);
      var hasChanged = _this.state.isSticky !== isSticky;

      var state = _this.state;
      if (state.height !== height || state.origin !== origin || state.isSticky !== isSticky) {
        _this.setState({ isSticky: isSticky, origin: origin, height: height });
      }

      _this.context.container.updateOffset(isSticky ? _this.state.height : 0);

      if (hasChanged) _this.props.onStickyStateChange(isSticky);
    };

    _this.onResize = function () {
      var height = _this.getHeight();
      var origin = _this.getOrigin(window.pageYOffset);

      _this.setState({ height: height, origin: origin });
    };

    _this.state = {
      isSticky: false
    };
    return _this;
  }

  _createClass(Sticky, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.update();
      this.on(['scroll', 'touchstart', 'touchmove', 'touchend', 'pageshow', 'load'], this.onScroll);
      this.on(['resize', 'pageshow', 'load'], this.onResize);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps() {
      this.update();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.off(['scroll', 'touchstart', 'touchmove', 'touchend', 'pageshow', 'load'], this.onScroll);
      this.off(['resize', 'pageshow', 'load'], this.onResize);
    }
  }, {
    key: 'getOrigin',
    value: function getOrigin(pageY) {
      return this.refs.placeholder.getBoundingClientRect().top + pageY;
    }
  }, {
    key: 'getHeight',
    value: function getHeight() {
      return _reactDom2.default.findDOMNode(this).getBoundingClientRect().height;
    }
  }, {
    key: 'update',
    value: function update() {
      var height = this.getHeight();
      var pageY = window.pageYOffset;
      var origin = this.getOrigin(pageY);
      var isSticky = this.isSticky(pageY, origin);

      var s = this.state;
      if (s.height !== height || s.origin !== origin || s.isSticky !== isSticky) this.setState({ height: height, origin: origin, isSticky: isSticky });
    }
  }, {
    key: 'isSticky',
    value: function isSticky(pageY, origin) {
      return this.props.isActive && pageY + this.context.offset - this.props.topOffset >= origin && this.context.offset <= (this.context.rect.bottom || 0) - this.props.bottomOffset;
    }
  }, {
    key: 'on',
    value: function on(events, callback) {
      events.forEach(function (evt) {
        window.addEventListener(evt, callback);
      });
    }
  }, {
    key: 'off',
    value: function off(events, callback) {
      events.forEach(function (evt) {
        window.removeEventListener(evt, callback);
      });
    }

    /*
     * The special sauce.
     */

  }, {
    key: 'render',
    value: function render() {
      var isSticky = this.state.isSticky;

      var className = this.props.className;
      if (isSticky) className += ' ' + this.props.stickyClassName;

      var style = this.props.style;
      if (isSticky) {
        var placeholderRect = this.refs.placeholder.getBoundingClientRect();
        var stickyStyle = {
          position: 'fixed',
          top: this.context.offset,
          left: placeholderRect.left,
          width: placeholderRect.width
        };

        var bottomLimit = (this.context.rect.bottom || 0) - this.state.height - this.props.bottomOffset;
        if (this.context.offset > bottomLimit) {
          stickyStyle.top = bottomLimit;
        }

        style = _extends({}, this.props.style, stickyStyle, this.props.stickyStyle);
      }

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement('div', { ref: 'placeholder', style: { paddingBottom: isSticky ? this.state.height : 0 } }),
        _react2.default.createElement(
          'div',
          _extends({}, this.props, { className: className, style: style }),
          this.props.children
        )
      );
    }
  }]);

  return Sticky;
}(_react2.default.Component);

Sticky.contextTypes = {
  container: _react2.default.PropTypes.any,
  offset: _react2.default.PropTypes.number,
  rect: _react2.default.PropTypes.object
};
Sticky.propTypes = {
  isActive: _react2.default.PropTypes.bool
};
Sticky.defaultProps = {
  isActive: true,
  className: '',
  style: {},
  stickyClassName: 'sticky',
  stickyStyle: {},
  topOffset: 0,
  bottomOffset: 0,
  onStickyStateChange: function onStickyStateChange() {}
};
exports.default = Sticky;
module.exports = exports['default'];