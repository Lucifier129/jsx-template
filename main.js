(function() {

    window.React = {
        createElement: createElement,
        render: render,
    }

    function render(vnode, container, callback) {
        var node = initVnode(vnode)
        container.innerHTML = ''
        container.appendChild(node)
        callback && callback()
        return node
    }

    function createElement(type, props, ...children) {
        props = props || {}
        props.children = children
        return {
            type: type,
            props: props,
        }
    }

    function initVnode(vnode) {
        switch (typeof vnode.type) {
            case 'string':
                return initVelem(vnode)
            case 'function':
                return initVcomponent(vnode)
            default:
                return initVtext(vnode + '')
        }
    }

    function initVcomponent(vcomponent) {
        return initVnode(vcomponent.type(vcomponent.props))
    }

    function initVelem(velem) {
        var node = document.createElement(velem.type)
        var initVchild = vchild => node.appendChild(initVnode(vchild))
        flatEach(velem.props.children, initVchild)
        setProps(node, velem.props)
        return node
    }

    function initVtext(vtext) {
        return document.createTextNode(vtext)
    }

    function setProps(elem, props) {
        for (var propName in props) {
            if (propName === 'children') {
                continue
            }
            setProp(elem, propName, props[propName])
        }
    }

    function setProp(elem, propName, propValue) {
        if (propName === 'style') {
            setStyle(elem, propValue)
        } else if (propName in elem) {
            elem[propName] = propValue
        } else {
            elem.setAttribute(propName, propValue + '')
        }
    }

    function setStyle(elem, style) {
        var elemStyle = elem.style
        for (var styleName in style) {
            setStyleValue(elemStyle, styleName, style[styleName])
        }
    }

    /**
     * CSS properties which accept numbers but are not in units of "px".
     */
    var isUnitlessNumber = {
        animationIterationCount: 1,
        borderImageOutset: 1,
        borderImageSlice: 1,
        borderImageWidth: 1,
        boxFlex: 1,
        boxFlexGroup: 1,
        boxOrdinalGroup: 1,
        columnCount: 1,
        flex: 1,
        flexGrow: 1,
        flexPositive: 1,
        flexShrink: 1,
        flexNegative: 1,
        flexOrder: 1,
        gridRow: 1,
        gridColumn: 1,
        fontWeight: 1,
        lineClamp: 1,
        lineHeight: 1,
        opacity: 1,
        order: 1,
        orphans: 1,
        tabSize: 1,
        widows: 1,
        zIndex: 1,
        zoom: 1,

        // SVG-related properties
        fillOpacity: 1,
        floodOpacity: 1,
        stopOpacity: 1,
        strokeDasharray: 1,
        strokeDashoffset: 1,
        strokeMiterlimit: 1,
        strokeOpacity: 1,
        strokeWidth: 1,
    }

    function prefixKey(prefix, key) {
        return prefix + key.charAt(0).toUpperCase() + key.substring(1)
    }

    var prefixes = ['Webkit', 'ms', 'Moz', 'O']

    Object.keys(isUnitlessNumber).forEach(function(prop) {
        prefixes.forEach(function(prefix) {
            isUnitlessNumber[prefixKey(prefix, prop)] = 1
        })
    })

    var RE_NUMBER = /^-?\d+(\.\d+)?$/

    function setStyleValue(elemStyle, styleName, styleValue) {

        if (!isUnitlessNumber[styleName] && RE_NUMBER.test(styleValue)) {
            elemStyle[styleName] = styleValue + 'px'
            return
        }

        if (styleName === 'float') {
            styleName = 'cssFloat'
        }

        if (styleValue == null || typeof styleValue === 'boolean') {
            styleValue = ''
        }

        elemStyle[styleName] = styleValue
    }

    function flatEach(list, handler) {
        for (var i = 0; i < list.length; i++) {
            var item = list[i]
            if (Array.isArray(item)) {
                flatEach(item, handler)
            } else if (item != null && typeof item !== 'boolean') {
                handler(item)
            }
        }
    }
})()
