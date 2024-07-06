// node_modules/preact/dist/preact.module.js
var d = function(n, l) {
  for (var u in l)
    n[u] = l[u];
  return n;
};
var w = function(n) {
  var l = n.parentNode;
  l && l.removeChild(n);
};
var g = function(n, t, i, o, r) {
  var f = { type: n, props: t, key: i, ref: o, __k: null, __: null, __b: 0, __e: null, __d: undefined, __c: null, constructor: undefined, __v: r == null ? ++u : r, __i: -1, __u: 0 };
  return r == null && l.vnode != null && l.vnode(f), f;
};
var k = function(n) {
  return n.children;
};
var b = function(n, l) {
  this.props = n, this.context = l;
};
var x = function(n, l) {
  if (l == null)
    return n.__ ? x(n.__, n.__i + 1) : null;
  for (var u;l < n.__k.length; l++)
    if ((u = n.__k[l]) != null && u.__e != null)
      return u.__e;
  return typeof n.type == "function" ? x(n) : null;
};
var C = function(n) {
  var l, u;
  if ((n = n.__) != null && n.__c != null) {
    for (n.__e = n.__c.base = null, l = 0;l < n.__k.length; l++)
      if ((u = n.__k[l]) != null && u.__e != null) {
        n.__e = n.__c.base = u.__e;
        break;
      }
    return C(n);
  }
};
var M = function(n) {
  (!n.__d && (n.__d = true) && i.push(n) && !P.__r++ || o !== l.debounceRendering) && ((o = l.debounceRendering) || r)(P);
};
var P = function() {
  var n, u, t, o, r, e, c, s;
  for (i.sort(f);n = i.shift(); )
    n.__d && (u = i.length, o = undefined, e = (r = (t = n).__v).__e, c = [], s = [], t.__P && ((o = d({}, r)).__v = r.__v + 1, l.vnode && l.vnode(o), O(t.__P, o, r, t.__n, t.__P.namespaceURI, 32 & r.__u ? [e] : null, c, e == null ? x(r) : e, !!(32 & r.__u), s), o.__v = r.__v, o.__.__k[o.__i] = o, j(c, o, s), o.__e != e && C(o)), i.length > u && i.sort(f));
  P.__r = 0;
};
var S = function(n, l, u, t, i, o, r, f, e, c, s) {
  var a, v, y, d2, w2, _ = t && t.__k || p, g2 = l.length;
  for (u.__d = e, $(u, l, _), e = u.__d, a = 0;a < g2; a++)
    (y = u.__k[a]) != null && typeof y != "boolean" && typeof y != "function" && (v = y.__i === -1 ? h : _[y.__i] || h, y.__i = a, O(n, y, v, i, o, r, f, e, c, s), d2 = y.__e, y.ref && v.ref != y.ref && (v.ref && N(v.ref, null, y), s.push(y.ref, y.__c || d2, y)), w2 == null && d2 != null && (w2 = d2), 65536 & y.__u || v.__k === y.__k ? (e && typeof y.type == "string" && !n.contains(e) && (e = x(v)), e = I(y, e, n)) : typeof y.type == "function" && y.__d !== undefined ? e = y.__d : d2 && (e = d2.nextSibling), y.__d = undefined, y.__u &= -196609);
  u.__d = e, u.__e = w2;
};
var $ = function(n, l, u) {
  var t, i, o, r, f, e = l.length, c = u.length, s = c, a = 0;
  for (n.__k = [], t = 0;t < e; t++)
    r = t + a, (i = n.__k[t] = (i = l[t]) == null || typeof i == "boolean" || typeof i == "function" ? null : typeof i == "string" || typeof i == "number" || typeof i == "bigint" || i.constructor == String ? g(null, i, null, null, null) : y(i) ? g(k, { children: i }, null, null, null) : i.constructor === undefined && i.__b > 0 ? g(i.type, i.props, i.key, i.ref ? i.ref : null, i.__v) : i) != null ? (i.__ = n, i.__b = n.__b + 1, f = L(i, u, r, s), i.__i = f, o = null, f !== -1 && (s--, (o = u[f]) && (o.__u |= 131072)), o == null || o.__v === null ? (f == -1 && a--, typeof i.type != "function" && (i.__u |= 65536)) : f !== r && (f == r - 1 ? a = f - r : f == r + 1 ? a++ : f > r ? s > e - r ? a += f - r : a-- : f < r && a++, f !== t + a && (i.__u |= 65536))) : (o = u[r]) && o.key == null && o.__e && (131072 & o.__u) == 0 && (o.__e == n.__d && (n.__d = x(o)), V(o, o, false), u[r] = null, s--);
  if (s)
    for (t = 0;t < c; t++)
      (o = u[t]) != null && (131072 & o.__u) == 0 && (o.__e == n.__d && (n.__d = x(o)), V(o, o));
};
var I = function(n, l, u) {
  var t, i;
  if (typeof n.type == "function") {
    for (t = n.__k, i = 0;t && i < t.length; i++)
      t[i] && (t[i].__ = n, l = I(t[i], l, u));
    return l;
  }
  n.__e != l && (u.insertBefore(n.__e, l || null), l = n.__e);
  do {
    l = l && l.nextSibling;
  } while (l != null && l.nodeType === 8);
  return l;
};
var L = function(n, l, u, t) {
  var { key: i, type: o } = n, r = u - 1, f = u + 1, e = l[u];
  if (e === null || e && i == e.key && o === e.type && (131072 & e.__u) == 0)
    return u;
  if (t > (e != null && (131072 & e.__u) == 0 ? 1 : 0))
    for (;r >= 0 || f < l.length; ) {
      if (r >= 0) {
        if ((e = l[r]) && (131072 & e.__u) == 0 && i == e.key && o === e.type)
          return r;
        r--;
      }
      if (f < l.length) {
        if ((e = l[f]) && (131072 & e.__u) == 0 && i == e.key && o === e.type)
          return f;
        f++;
      }
    }
  return -1;
};
var T = function(n, l, u) {
  l[0] === "-" ? n.setProperty(l, u == null ? "" : u) : n[l] = u == null ? "" : typeof u != "number" || v.test(l) ? u : u + "px";
};
var A = function(n, l, u, t, i) {
  var o;
  n:
    if (l === "style")
      if (typeof u == "string")
        n.style.cssText = u;
      else {
        if (typeof t == "string" && (n.style.cssText = t = ""), t)
          for (l in t)
            u && l in u || T(n.style, l, "");
        if (u)
          for (l in u)
            t && u[l] === t[l] || T(n.style, l, u[l]);
      }
    else if (l[0] === "o" && l[1] === "n")
      o = l !== (l = l.replace(/(PointerCapture)$|Capture$/i, "$1")), l = l.toLowerCase() in n || l === "onFocusOut" || l === "onFocusIn" ? l.toLowerCase().slice(2) : l.slice(2), n.l || (n.l = {}), n.l[l + o] = u, u ? t ? u.u = t.u : (u.u = e, n.addEventListener(l, o ? s : c, o)) : n.removeEventListener(l, o ? s : c, o);
    else {
      if (i == "http://www.w3.org/2000/svg")
        l = l.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
      else if (l != "width" && l != "height" && l != "href" && l != "list" && l != "form" && l != "tabIndex" && l != "download" && l != "rowSpan" && l != "colSpan" && l != "role" && l != "popover" && l in n)
        try {
          n[l] = u == null ? "" : u;
          break n;
        } catch (n2) {
        }
      typeof u == "function" || (u == null || u === false && l[4] !== "-" ? n.removeAttribute(l) : n.setAttribute(l, l == "popover" && u == 1 ? "" : u));
    }
};
var F = function(n) {
  return function(u) {
    if (this.l) {
      var t = this.l[u.type + n];
      if (u.t == null)
        u.t = e++;
      else if (u.t < t.u)
        return;
      return t(l.event ? l.event(u) : u);
    }
  };
};
var O = function(n, u, t, i, o, r, f, e, c, s) {
  var a, h, p, v, w2, _, g2, m, x2, C2, M2, P2, $2, I2, H, L2, T2 = u.type;
  if (u.constructor !== undefined)
    return null;
  128 & t.__u && (c = !!(32 & t.__u), r = [e = u.__e = t.__e]), (a = l.__b) && a(u);
  n:
    if (typeof T2 == "function")
      try {
        if (m = u.props, x2 = "prototype" in T2 && T2.prototype.render, C2 = (a = T2.contextType) && i[a.__c], M2 = a ? C2 ? C2.props.value : a.__ : i, t.__c ? g2 = (h = u.__c = t.__c).__ = h.__E : (x2 ? u.__c = h = new T2(m, M2) : (u.__c = h = new b(m, M2), h.constructor = T2, h.render = q), C2 && C2.sub(h), h.props = m, h.state || (h.state = {}), h.context = M2, h.__n = i, p = h.__d = true, h.__h = [], h._sb = []), x2 && h.__s == null && (h.__s = h.state), x2 && T2.getDerivedStateFromProps != null && (h.__s == h.state && (h.__s = d({}, h.__s)), d(h.__s, T2.getDerivedStateFromProps(m, h.__s))), v = h.props, w2 = h.state, h.__v = u, p)
          x2 && T2.getDerivedStateFromProps == null && h.componentWillMount != null && h.componentWillMount(), x2 && h.componentDidMount != null && h.__h.push(h.componentDidMount);
        else {
          if (x2 && T2.getDerivedStateFromProps == null && m !== v && h.componentWillReceiveProps != null && h.componentWillReceiveProps(m, M2), !h.__e && (h.shouldComponentUpdate != null && h.shouldComponentUpdate(m, h.__s, M2) === false || u.__v === t.__v)) {
            for (u.__v !== t.__v && (h.props = m, h.state = h.__s, h.__d = false), u.__e = t.__e, u.__k = t.__k, u.__k.forEach(function(n2) {
              n2 && (n2.__ = u);
            }), P2 = 0;P2 < h._sb.length; P2++)
              h.__h.push(h._sb[P2]);
            h._sb = [], h.__h.length && f.push(h);
            break n;
          }
          h.componentWillUpdate != null && h.componentWillUpdate(m, h.__s, M2), x2 && h.componentDidUpdate != null && h.__h.push(function() {
            h.componentDidUpdate(v, w2, _);
          });
        }
        if (h.context = M2, h.props = m, h.__P = n, h.__e = false, $2 = l.__r, I2 = 0, x2) {
          for (h.state = h.__s, h.__d = false, $2 && $2(u), a = h.render(h.props, h.state, h.context), H = 0;H < h._sb.length; H++)
            h.__h.push(h._sb[H]);
          h._sb = [];
        } else
          do {
            h.__d = false, $2 && $2(u), a = h.render(h.props, h.state, h.context), h.state = h.__s;
          } while (h.__d && ++I2 < 25);
        h.state = h.__s, h.getChildContext != null && (i = d(d({}, i), h.getChildContext())), x2 && !p && h.getSnapshotBeforeUpdate != null && (_ = h.getSnapshotBeforeUpdate(v, w2)), S(n, y(L2 = a != null && a.type === k && a.key == null ? a.props.children : a) ? L2 : [L2], u, t, i, o, r, f, e, c, s), h.base = u.__e, u.__u &= -161, h.__h.length && f.push(h), g2 && (h.__E = h.__ = null);
      } catch (n2) {
        u.__v = null, c || r != null ? (u.__e = e, u.__u |= c ? 160 : 32, r[r.indexOf(e)] = null) : (u.__e = t.__e, u.__k = t.__k), l.__e(n2, u, t);
      }
    else
      r == null && u.__v === t.__v ? (u.__k = t.__k, u.__e = t.__e) : u.__e = z(t.__e, u, t, i, o, r, f, c, s);
  (a = l.diffed) && a(u);
};
var j = function(n, u, t) {
  u.__d = undefined;
  for (var i = 0;i < t.length; i++)
    N(t[i], t[++i], t[++i]);
  l.__c && l.__c(u, n), n.some(function(u2) {
    try {
      n = u2.__h, u2.__h = [], n.some(function(n2) {
        n2.call(u2);
      });
    } catch (n2) {
      l.__e(n2, u2.__v);
    }
  });
};
var z = function(l, u, t, i, o, r, f, e, c) {
  var s, a, p, v, d2, _, g2, m = t.props, k2 = u.props, b2 = u.type;
  if (b2 === "svg" ? o = "http://www.w3.org/2000/svg" : b2 === "math" ? o = "http://www.w3.org/1998/Math/MathML" : o || (o = "http://www.w3.org/1999/xhtml"), r != null) {
    for (s = 0;s < r.length; s++)
      if ((d2 = r[s]) && "setAttribute" in d2 == !!b2 && (b2 ? d2.localName === b2 : d2.nodeType === 3)) {
        l = d2, r[s] = null;
        break;
      }
  }
  if (l == null) {
    if (b2 === null)
      return document.createTextNode(k2);
    l = document.createElementNS(o, b2, k2.is && k2), r = null, e = false;
  }
  if (b2 === null)
    m === k2 || e && l.data === k2 || (l.data = k2);
  else {
    if (r = r && n.call(l.childNodes), m = t.props || h, !e && r != null)
      for (m = {}, s = 0;s < l.attributes.length; s++)
        m[(d2 = l.attributes[s]).name] = d2.value;
    for (s in m)
      if (d2 = m[s], s == "children")
        ;
      else if (s == "dangerouslySetInnerHTML")
        p = d2;
      else if (s !== "key" && !(s in k2)) {
        if (s == "value" && "defaultValue" in k2 || s == "checked" && "defaultChecked" in k2)
          continue;
        A(l, s, null, d2, o);
      }
    for (s in k2)
      d2 = k2[s], s == "children" ? v = d2 : s == "dangerouslySetInnerHTML" ? a = d2 : s == "value" ? _ = d2 : s == "checked" ? g2 = d2 : s === "key" || e && typeof d2 != "function" || m[s] === d2 || A(l, s, d2, m[s], o);
    if (a)
      e || p && (a.__html === p.__html || a.__html === l.innerHTML) || (l.innerHTML = a.__html), u.__k = [];
    else if (p && (l.innerHTML = ""), S(l, y(v) ? v : [v], u, t, i, b2 === "foreignObject" ? "http://www.w3.org/1999/xhtml" : o, r, f, r ? r[0] : t.__k && x(t, 0), e, c), r != null)
      for (s = r.length;s--; )
        r[s] != null && w(r[s]);
    e || (s = "value", _ !== undefined && (_ !== l[s] || b2 === "progress" && !_ || b2 === "option" && _ !== m[s]) && A(l, s, _, m[s], o), s = "checked", g2 !== undefined && g2 !== l[s] && A(l, s, g2, m[s], o));
  }
  return l;
};
var N = function(n, u, t) {
  try {
    typeof n == "function" ? n(u) : n.current = u;
  } catch (n2) {
    l.__e(n2, t);
  }
};
var V = function(n, u, t) {
  var i, o;
  if (l.unmount && l.unmount(n), (i = n.ref) && (i.current && i.current !== n.__e || N(i, null, u)), (i = n.__c) != null) {
    if (i.componentWillUnmount)
      try {
        i.componentWillUnmount();
      } catch (n2) {
        l.__e(n2, u);
      }
    i.base = i.__P = null;
  }
  if (i = n.__k)
    for (o = 0;o < i.length; o++)
      i[o] && V(i[o], u, t || typeof n.type != "function");
  t || n.__e == null || w(n.__e), n.__c = n.__ = n.__e = n.__d = undefined;
};
var q = function(n, l, u) {
  return this.constructor(n, u);
};
var n;
var l;
var u;
var t;
var i;
var o;
var r;
var f;
var e;
var c;
var s;
var a;
var h = {};
var p = [];
var v = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
var y = Array.isArray;
n = p.slice, l = { __e: function(n2, l2, u2, t2) {
  for (var i2, o2, r2;l2 = l2.__; )
    if ((i2 = l2.__c) && !i2.__)
      try {
        if ((o2 = i2.constructor) && o2.getDerivedStateFromError != null && (i2.setState(o2.getDerivedStateFromError(n2)), r2 = i2.__d), i2.componentDidCatch != null && (i2.componentDidCatch(n2, t2 || {}), r2 = i2.__d), r2)
          return i2.__E = i2;
      } catch (l3) {
        n2 = l3;
      }
  throw n2;
} }, u = 0, t = function(n2) {
  return n2 != null && n2.constructor == null;
}, b.prototype.setState = function(n2, l2) {
  var u2;
  u2 = this.__s != null && this.__s !== this.state ? this.__s : this.__s = d({}, this.state), typeof n2 == "function" && (n2 = n2(d({}, u2), this.props)), n2 && d(u2, n2), n2 != null && this.__v && (l2 && this._sb.push(l2), M(this));
}, b.prototype.forceUpdate = function(n2) {
  this.__v && (this.__e = true, n2 && this.__h.push(n2), M(this));
}, b.prototype.render = k, i = [], r = typeof Promise == "function" ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, f = function(n2, l2) {
  return n2.__v.__b - l2.__v.__b;
}, P.__r = 0, e = 0, c = F(false), s = F(true), a = 0;
// node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js
var u2 = function(e2, t2, n2, o2, i2, u3) {
  t2 || (t2 = {});
  var a2, c2, p2 = t2;
  if ("ref" in p2)
    for (c2 in p2 = {}, t2)
      c2 == "ref" ? a2 = t2[c2] : p2[c2] = t2[c2];
  var l2 = { type: e2, props: p2, key: n2, ref: a2, __k: null, __: null, __b: 0, __e: null, __d: undefined, __c: null, constructor: undefined, __v: --f2, __i: -1, __u: 0, __source: i2, __self: u3 };
  if (typeof e2 == "function" && (a2 = e2.defaultProps))
    for (c2 in a2)
      p2[c2] === undefined && (p2[c2] = a2[c2]);
  return l.vnode && l.vnode(l2), l2;
};
var f2 = 0;
var i2 = Array.isArray;

// lite/build/example.mdx
var _createMdxContent = function(props) {
  const _components = {
    h1: "h1",
    ...props.components
  };
  return u2(_components.h1, {
    children: ["Hello ", props.name.toUpperCase()]
  });
};
var frontmatter = undefined;
function MDXContent(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? u2(MDXLayout, {
    ...props,
    children: u2(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}
export {
  frontmatter,
  MDXContent as default
};
