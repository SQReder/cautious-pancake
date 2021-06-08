'use strict';

function getAugmentedNamespace(n) {
	if (n.__esModule) return n;
	var a = Object.defineProperty({}, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}

var unistBuilder = u$c;

function u$c(type, props, value) {
  var node;

  if (
    (value === null || value === undefined) &&
    (typeof props !== 'object' || Array.isArray(props))
  ) {
    value = props;
    props = {};
  }

  node = Object.assign({type: String(type)}, props);

  if (Array.isArray(value)) {
    node.children = value;
  } else if (value !== null && value !== undefined) {
    node.value = String(value);
  }

  return node
}

var convert_1$1 = convert$6;

function convert$6(test) {
  if (test == null) {
    return ok$1
  }

  if (typeof test === 'string') {
    return typeFactory(test)
  }

  if (typeof test === 'object') {
    return 'length' in test ? anyFactory(test) : allFactory(test)
  }

  if (typeof test === 'function') {
    return test
  }

  throw new Error('Expected function, string, or object as test')
}

// Utility assert each property in `test` is represented in `node`, and each
// values are strictly equal.
function allFactory(test) {
  return all

  function all(node) {
    var key;

    for (key in test) {
      if (node[key] !== test[key]) return false
    }

    return true
  }
}

function anyFactory(tests) {
  var checks = [];
  var index = -1;

  while (++index < tests.length) {
    checks[index] = convert$6(tests[index]);
  }

  return any

  function any() {
    var index = -1;

    while (++index < checks.length) {
      if (checks[index].apply(this, arguments)) {
        return true
      }
    }

    return false
  }
}

// Utility to convert a string into a function which checks a given node’s type
// for said string.
function typeFactory(test) {
  return type

  function type(node) {
    return Boolean(node && node.type === test)
  }
}

// Utility to return true.
function ok$1() {
  return true
}

var color_1 = color$1;
function color$1(d) {
  return '\u001B[33m' + d + '\u001B[39m'
}

var unistUtilVisitParents = visitParents$1;

var convert$5 = convert_1$1;
var color = color_1;

var CONTINUE$1 = true;
var SKIP$1 = 'skip';
var EXIT$1 = false;

visitParents$1.CONTINUE = CONTINUE$1;
visitParents$1.SKIP = SKIP$1;
visitParents$1.EXIT = EXIT$1;

function visitParents$1(tree, test, visitor, reverse) {
  var step;
  var is;

  if (typeof test === 'function' && typeof visitor !== 'function') {
    reverse = visitor;
    visitor = test;
    test = null;
  }

  is = convert$5(test);
  step = reverse ? -1 : 1;

  factory(tree, null, [])();

  function factory(node, index, parents) {
    var value = typeof node === 'object' && node !== null ? node : {};
    var name;

    if (typeof value.type === 'string') {
      name =
        typeof value.tagName === 'string'
          ? value.tagName
          : typeof value.name === 'string'
          ? value.name
          : undefined;

      visit.displayName =
        'node (' + color(value.type + (name ? '<' + name + '>' : '')) + ')';
    }

    return visit

    function visit() {
      var grandparents = parents.concat(node);
      var result = [];
      var subresult;
      var offset;

      if (!test || is(node, index, parents[parents.length - 1] || null)) {
        result = toResult(visitor(node, parents));

        if (result[0] === EXIT$1) {
          return result
        }
      }

      if (node.children && result[0] !== SKIP$1) {
        offset = (reverse ? node.children.length : -1) + step;

        while (offset > -1 && offset < node.children.length) {
          subresult = factory(node.children[offset], offset, grandparents)();

          if (subresult[0] === EXIT$1) {
            return subresult
          }

          offset =
            typeof subresult[1] === 'number' ? subresult[1] : offset + step;
        }
      }

      return result
    }
  }
}

function toResult(value) {
  if (value !== null && typeof value === 'object' && 'length' in value) {
    return value
  }

  if (typeof value === 'number') {
    return [CONTINUE$1, value]
  }

  return [value]
}

var unistUtilVisit = visit$2;

var visitParents = unistUtilVisitParents;

var CONTINUE = visitParents.CONTINUE;
var SKIP = visitParents.SKIP;
var EXIT = visitParents.EXIT;

visit$2.CONTINUE = CONTINUE;
visit$2.SKIP = SKIP;
visit$2.EXIT = EXIT;

function visit$2(tree, test, visitor, reverse) {
  if (typeof test === 'function' && typeof visitor !== 'function') {
    reverse = visitor;
    visitor = test;
    test = null;
  }

  visitParents(tree, test, overload, reverse);

  function overload(node, parents) {
    var parent = parents[parents.length - 1];
    var index = parent ? parent.children.indexOf(node) : null;
    return visitor(node, index, parent)
  }
}

var start = factory$3('start');
var end = factory$3('end');

var unistUtilPosition = position$2;

position$2.start = start;
position$2.end = end;

function position$2(node) {
  return {start: start(node), end: end(node)}
}

function factory$3(type) {
  point.displayName = type;

  return point

  function point(node) {
    var point = (node && node.position && node.position[type]) || {};

    return {
      line: point.line || null,
      column: point.column || null,
      offset: isNaN(point.offset) ? null : point.offset
    }
  }
}

var unistUtilGenerated = generated$1;

function generated$1(node) {
  return (
    !node ||
    !node.position ||
    !node.position.start ||
    !node.position.start.line ||
    !node.position.start.column ||
    !node.position.end ||
    !node.position.end.line ||
    !node.position.end.column
  )
}

var visit$1 = unistUtilVisit;

var mdastUtilDefinitions = getDefinitionFactory;

var own$7 = {}.hasOwnProperty;

// Get a definition in `node` by `identifier`.
function getDefinitionFactory(node, options) {
  return getterFactory(gather(node))
}

// Gather all definitions in `node`
function gather(node) {
  var cache = {};

  if (!node || !node.type) {
    throw new Error('mdast-util-definitions expected node')
  }

  visit$1(node, 'definition', ondefinition);

  return cache

  function ondefinition(definition) {
    var id = normalise(definition.identifier);
    if (!own$7.call(cache, id)) {
      cache[id] = definition;
    }
  }
}

// Factory to get a node from the given definition-cache.
function getterFactory(cache) {
  return getter

  // Get a node from the bound definition-cache.
  function getter(identifier) {
    var id = identifier && normalise(identifier);
    return id && own$7.call(cache, id) ? cache[id] : null
  }
}

function normalise(identifier) {
  return identifier.toUpperCase()
}

var all_1$1 = all$g;

var one$5 = one_1;

function all$g(h, parent) {
  var nodes = parent.children || [];
  var length = nodes.length;
  var values = [];
  var index = -1;
  var result;
  var head;

  while (++index < length) {
    result = one$5(h, nodes[index], parent);

    if (result) {
      if (index && nodes[index - 1].type === 'break') {
        if (result.value) {
          result.value = result.value.replace(/^\s+/, '');
        }

        head = result.children && result.children[0];

        if (head && head.value) {
          head.value = head.value.replace(/^\s+/, '');
        }
      }

      values = values.concat(result);
    }
  }

  return values
}

var one_1 = one$4;

var u$b = unistBuilder;
var all$f = all_1$1;

var own$6 = {}.hasOwnProperty;

// Transform an unknown node.
function unknown(h, node) {
  if (text$3(node)) {
    return h.augment(node, u$b('text', node.value))
  }

  return h(node, 'div', all$f(h, node))
}

// Visit a node.
function one$4(h, node, parent) {
  var type = node && node.type;
  var fn;

  // Fail on non-nodes.
  if (!type) {
    throw new Error('Expected node, got `' + node + '`')
  }

  if (own$6.call(h.handlers, type)) {
    fn = h.handlers[type];
  } else if (h.passThrough && h.passThrough.indexOf(type) > -1) {
    fn = returnNode;
  } else {
    fn = h.unknownHandler;
  }

  return (typeof fn === 'function' ? fn : unknown)(h, node, parent)
}

// Check if the node should be renderered as a text node.
function text$3(node) {
  var data = node.data || {};

  if (
    own$6.call(data, 'hName') ||
    own$6.call(data, 'hProperties') ||
    own$6.call(data, 'hChildren')
  ) {
    return false
  }

  return 'value' in node
}

function returnNode(h, node) {
  var clone;

  if (node.children) {
    clone = Object.assign({}, node);
    clone.children = all$f(h, node);
    return clone
  }

  return node
}

var thematicBreak_1 = thematicBreak$1;

function thematicBreak$1(h, node) {
  return h(node, 'hr')
}

var wrap_1 = wrap$5;

var u$a = unistBuilder;

// Wrap `nodes` with line feeds between each entry.
// Optionally adds line feeds at the start and end.
function wrap$5(nodes, loose) {
  var result = [];
  var index = -1;
  var length = nodes.length;

  if (loose) {
    result.push(u$a('text', '\n'));
  }

  while (++index < length) {
    if (index) {
      result.push(u$a('text', '\n'));
    }

    result.push(nodes[index]);
  }

  if (loose && nodes.length > 0) {
    result.push(u$a('text', '\n'));
  }

  return result
}

var list_1 = list$3;

var wrap$4 = wrap_1;
var all$e = all_1$1;

function list$3(h, node) {
  var props = {};
  var name = node.ordered ? 'ol' : 'ul';
  var items;
  var index = -1;
  var length;

  if (typeof node.start === 'number' && node.start !== 1) {
    props.start = node.start;
  }

  items = all$e(h, node);
  length = items.length;

  // Like GitHub, add a class for custom styling.
  while (++index < length) {
    if (
      items[index].properties.className &&
      items[index].properties.className.indexOf('task-list-item') !== -1
    ) {
      props.className = ['contains-task-list'];
      break
    }
  }

  return h(node, name, props, wrap$4(items, true))
}

var footer$1 = generateFootnotes;

var thematicBreak = thematicBreak_1;
var list$2 = list_1;
var wrap$3 = wrap_1;

function generateFootnotes(h) {
  var footnoteById = h.footnoteById;
  var footnoteOrder = h.footnoteOrder;
  var length = footnoteOrder.length;
  var index = -1;
  var listItems = [];
  var def;
  var backReference;
  var content;
  var tail;

  while (++index < length) {
    def = footnoteById[footnoteOrder[index].toUpperCase()];

    if (!def) {
      continue
    }

    content = def.children.concat();
    tail = content[content.length - 1];
    backReference = {
      type: 'link',
      url: '#fnref-' + def.identifier,
      data: {hProperties: {className: ['footnote-backref']}},
      children: [{type: 'text', value: '↩'}]
    };

    if (!tail || tail.type !== 'paragraph') {
      tail = {type: 'paragraph', children: []};
      content.push(tail);
    }

    tail.children.push(backReference);

    listItems.push({
      type: 'listItem',
      data: {hProperties: {id: 'fn-' + def.identifier}},
      children: content,
      position: def.position
    });
  }

  if (listItems.length === 0) {
    return null
  }

  return h(
    null,
    'div',
    {className: ['footnotes']},
    wrap$3(
      [
        thematicBreak(h),
        list$2(h, {type: 'list', ordered: true, children: listItems})
      ],
      true
    )
  )
}

var blockquote_1 = blockquote;

var wrap$2 = wrap_1;
var all$d = all_1$1;

function blockquote(h, node) {
  return h(node, 'blockquote', wrap$2(all$d(h, node), true))
}

var _break = hardBreak;

var u$9 = unistBuilder;

function hardBreak(h, node) {
  return [h(node, 'br'), u$9('text', '\n')]
}

var code_1 = code;

var u$8 = unistBuilder;

function code(h, node) {
  var value = node.value ? node.value + '\n' : '';
  // To do: next major, use `node.lang` w/o regex, the splitting’s been going
  // on for years in remark now.
  var lang = node.lang && node.lang.match(/^[^ \t]+(?=[ \t]|$)/);
  var props = {};
  var code;

  if (lang) {
    props.className = ['language-' + lang];
  }

  code = h(node, 'code', props, [u$8('text', value)]);

  if (node.meta) {
    code.data = {meta: node.meta};
  }

  return h(node.position, 'pre', [code])
}

var _delete = strikethrough;

var all$c = all_1$1;

function strikethrough(h, node) {
  return h(node, 'del', all$c(h, node))
}

var emphasis_1 = emphasis;

var all$b = all_1$1;

function emphasis(h, node) {
  return h(node, 'em', all$b(h, node))
}

var footnoteReference_1 = footnoteReference$1;

var u$7 = unistBuilder;

function footnoteReference$1(h, node) {
  var footnoteOrder = h.footnoteOrder;
  var identifier = String(node.identifier);

  if (footnoteOrder.indexOf(identifier) === -1) {
    footnoteOrder.push(identifier);
  }

  return h(node.position, 'sup', {id: 'fnref-' + identifier}, [
    h(node, 'a', {href: '#fn-' + identifier, className: ['footnote-ref']}, [
      u$7('text', node.label || identifier)
    ])
  ])
}

var footnote_1 = footnote;

var footnoteReference = footnoteReference_1;

function footnote(h, node) {
  var footnoteById = h.footnoteById;
  var footnoteOrder = h.footnoteOrder;
  var identifier = 1;

  while (identifier in footnoteById) {
    identifier++;
  }

  identifier = String(identifier);

  // No need to check if `identifier` exists in `footnoteOrder`, it’s guaranteed
  // to not exist because we just generated it.
  footnoteOrder.push(identifier);

  footnoteById[identifier] = {
    type: 'footnoteDefinition',
    identifier: identifier,
    children: [{type: 'paragraph', children: node.children}],
    position: node.position
  };

  return footnoteReference(h, {
    type: 'footnoteReference',
    identifier: identifier,
    position: node.position
  })
}

var heading_1 = heading;

var all$a = all_1$1;

function heading(h, node) {
  return h(node, 'h' + node.depth, all$a(h, node))
}

var html_1$2 = html$6;

var u$6 = unistBuilder;

// Return either a `raw` node in dangerous mode, otherwise nothing.
function html$6(h, node) {
  return h.dangerous ? h.augment(node, u$6('raw', node.value)) : null
}

var encodeCache = {};


// Create a lookup array where anything but characters in `chars` string
// and alphanumeric chars is percent-encoded.
//
function getEncodeCache(exclude) {
  var i, ch, cache = encodeCache[exclude];
  if (cache) { return cache; }

  cache = encodeCache[exclude] = [];

  for (i = 0; i < 128; i++) {
    ch = String.fromCharCode(i);

    if (/^[0-9a-z]$/i.test(ch)) {
      // always allow unencoded alphanumeric characters
      cache.push(ch);
    } else {
      cache.push('%' + ('0' + i.toString(16).toUpperCase()).slice(-2));
    }
  }

  for (i = 0; i < exclude.length; i++) {
    cache[exclude.charCodeAt(i)] = exclude[i];
  }

  return cache;
}


// Encode unsafe characters with percent-encoding, skipping already
// encoded sequences.
//
//  - string       - string to encode
//  - exclude      - list of characters to ignore (in addition to a-zA-Z0-9)
//  - keepEscaped  - don't encode '%' in a correct escape sequence (default: true)
//
function encode$3(string, exclude, keepEscaped) {
  var i, l, code, nextCode, cache,
      result = '';

  if (typeof exclude !== 'string') {
    // encode(string, keepEscaped)
    keepEscaped  = exclude;
    exclude = encode$3.defaultChars;
  }

  if (typeof keepEscaped === 'undefined') {
    keepEscaped = true;
  }

  cache = getEncodeCache(exclude);

  for (i = 0, l = string.length; i < l; i++) {
    code = string.charCodeAt(i);

    if (keepEscaped && code === 0x25 /* % */ && i + 2 < l) {
      if (/^[0-9a-f]{2}$/i.test(string.slice(i + 1, i + 3))) {
        result += string.slice(i, i + 3);
        i += 2;
        continue;
      }
    }

    if (code < 128) {
      result += cache[code];
      continue;
    }

    if (code >= 0xD800 && code <= 0xDFFF) {
      if (code >= 0xD800 && code <= 0xDBFF && i + 1 < l) {
        nextCode = string.charCodeAt(i + 1);
        if (nextCode >= 0xDC00 && nextCode <= 0xDFFF) {
          result += encodeURIComponent(string[i] + string[i + 1]);
          i++;
          continue;
        }
      }
      result += '%EF%BF%BD';
      continue;
    }

    result += encodeURIComponent(string[i]);
  }

  return result;
}

encode$3.defaultChars   = ";/?:@&=+$,-_.!~*'()#";
encode$3.componentChars = "-_.!~*'()";


var encode_1$1 = encode$3;

var revert_1 = revert$2;

var u$5 = unistBuilder;
var all$9 = all_1$1;

// Return the content of a reference without definition as Markdown.
function revert$2(h, node) {
  var subtype = node.referenceType;
  var suffix = ']';
  var contents;
  var head;
  var tail;

  if (subtype === 'collapsed') {
    suffix += '[]';
  } else if (subtype === 'full') {
    suffix += '[' + (node.label || node.identifier) + ']';
  }

  if (node.type === 'imageReference') {
    return u$5('text', '![' + node.alt + suffix)
  }

  contents = all$9(h, node);
  head = contents[0];

  if (head && head.type === 'text') {
    head.value = '[' + head.value;
  } else {
    contents.unshift(u$5('text', '['));
  }

  tail = contents[contents.length - 1];

  if (tail && tail.type === 'text') {
    tail.value += suffix;
  } else {
    contents.push(u$5('text', suffix));
  }

  return contents
}

var imageReference_1 = imageReference;

var normalize$7 = encode_1$1;
var revert$1 = revert_1;

function imageReference(h, node) {
  var def = h.definition(node.identifier);
  var props;

  if (!def) {
    return revert$1(h, node)
  }

  props = {src: normalize$7(def.url || ''), alt: node.alt};

  if (def.title !== null && def.title !== undefined) {
    props.title = def.title;
  }

  return h(node, 'img', props)
}

var normalize$6 = encode_1$1;

var image_1 = image$1;

function image$1(h, node) {
  var props = {src: normalize$6(node.url), alt: node.alt};

  if (node.title !== null && node.title !== undefined) {
    props.title = node.title;
  }

  return h(node, 'img', props)
}

var inlineCode_1 = inlineCode;

var u$4 = unistBuilder;

function inlineCode(h, node) {
  var value = node.value.replace(/\r?\n|\r/g, ' ');
  return h(node, 'code', [u$4('text', value)])
}

var linkReference_1 = linkReference;

var normalize$5 = encode_1$1;
var revert = revert_1;
var all$8 = all_1$1;

function linkReference(h, node) {
  var def = h.definition(node.identifier);
  var props;

  if (!def) {
    return revert(h, node)
  }

  props = {href: normalize$5(def.url || '')};

  if (def.title !== null && def.title !== undefined) {
    props.title = def.title;
  }

  return h(node, 'a', props, all$8(h, node))
}

var normalize$4 = encode_1$1;
var all$7 = all_1$1;

var link_1 = link;

function link(h, node) {
  var props = {href: normalize$4(node.url)};

  if (node.title !== null && node.title !== undefined) {
    props.title = node.title;
  }

  return h(node, 'a', props, all$7(h, node))
}

var listItem_1 = listItem;

var u$3 = unistBuilder;
var all$6 = all_1$1;

function listItem(h, node, parent) {
  var result = all$6(h, node);
  var head = result[0];
  var loose = parent ? listLoose(parent) : listItemLoose(node);
  var props = {};
  var wrapped = [];
  var length;
  var index;
  var child;

  if (typeof node.checked === 'boolean') {
    if (!head || head.tagName !== 'p') {
      head = h(null, 'p', []);
      result.unshift(head);
    }

    if (head.children.length > 0) {
      head.children.unshift(u$3('text', ' '));
    }

    head.children.unshift(
      h(null, 'input', {
        type: 'checkbox',
        checked: node.checked,
        disabled: true
      })
    );

    // According to github-markdown-css, this class hides bullet.
    // See: <https://github.com/sindresorhus/github-markdown-css>.
    props.className = ['task-list-item'];
  }

  length = result.length;
  index = -1;

  while (++index < length) {
    child = result[index];

    // Add eols before nodes, except if this is a loose, first paragraph.
    if (loose || index !== 0 || child.tagName !== 'p') {
      wrapped.push(u$3('text', '\n'));
    }

    if (child.tagName === 'p' && !loose) {
      wrapped = wrapped.concat(child.children);
    } else {
      wrapped.push(child);
    }
  }

  // Add a final eol.
  if (length && (loose || child.tagName !== 'p')) {
    wrapped.push(u$3('text', '\n'));
  }

  return h(node, 'li', props, wrapped)
}

function listLoose(node) {
  var loose = node.spread;
  var children = node.children;
  var length = children.length;
  var index = -1;

  while (!loose && ++index < length) {
    loose = listItemLoose(children[index]);
  }

  return loose
}

function listItemLoose(node) {
  var spread = node.spread;

  return spread === undefined || spread === null
    ? node.children.length > 1
    : spread
}

var paragraph_1 = paragraph;

var all$5 = all_1$1;

function paragraph(h, node) {
  return h(node, 'p', all$5(h, node))
}

var root_1 = root;

var u$2 = unistBuilder;
var wrap$1 = wrap_1;
var all$4 = all_1$1;

function root(h, node) {
  return h.augment(node, u$2('root', wrap$1(all$4(h, node))))
}

var strong_1 = strong;

var all$3 = all_1$1;

function strong(h, node) {
  return h(node, 'strong', all$3(h, node))
}

var table_1 = table;

var position$1 = unistUtilPosition;
var wrap = wrap_1;
var all$2 = all_1$1;

function table(h, node) {
  var rows = node.children;
  var index = rows.length;
  var align = node.align || [];
  var alignLength = align.length;
  var result = [];
  var pos;
  var row;
  var out;
  var name;
  var cell;

  while (index--) {
    row = rows[index].children;
    name = index === 0 ? 'th' : 'td';
    pos = alignLength || row.length;
    out = [];

    while (pos--) {
      cell = row[pos];
      out[pos] = h(cell, name, {align: align[pos]}, cell ? all$2(h, cell) : []);
    }

    result[index] = h(rows[index], 'tr', wrap(out, true));
  }

  return h(
    node,
    'table',
    wrap(
      [h(result[0].position, 'thead', wrap([result[0]], true))].concat(
        result[1]
          ? h(
              {
                start: position$1.start(result[1]),
                end: position$1.end(result[result.length - 1])
              },
              'tbody',
              wrap(result.slice(1), true)
            )
          : []
      ),
      true
    )
  )
}

var text_1 = text$2;

var u$1 = unistBuilder;

function text$2(h, node) {
  return h.augment(
    node,
    u$1('text', String(node.value).replace(/[ \t]*(\r?\n|\r)[ \t]*/g, '$1'))
  )
}

var handlers$2 = {
  blockquote: blockquote_1,
  break: _break,
  code: code_1,
  delete: _delete,
  emphasis: emphasis_1,
  footnoteReference: footnoteReference_1,
  footnote: footnote_1,
  heading: heading_1,
  html: html_1$2,
  imageReference: imageReference_1,
  image: image_1,
  inlineCode: inlineCode_1,
  linkReference: linkReference_1,
  link: link_1,
  listItem: listItem_1,
  list: list_1,
  paragraph: paragraph_1,
  root: root_1,
  strong: strong_1,
  table: table_1,
  text: text_1,
  thematicBreak: thematicBreak_1,
  toml: ignore,
  yaml: ignore,
  definition: ignore,
  footnoteDefinition: ignore
};

// Return nothing for nodes that are ignored.
function ignore() {
  return null
}

var lib$2 = toHast;

var u = unistBuilder;
var visit = unistUtilVisit;
var position = unistUtilPosition;
var generated = unistUtilGenerated;
var definitions = mdastUtilDefinitions;
var one$3 = one_1;
var footer = footer$1;
var handlers$1 = handlers$2;

var own$5 = {}.hasOwnProperty;

var deprecationWarningIssued$1 = false;

// Factory to transform.
function factory$2(tree, options) {
  var settings = options || {};

  // Issue a warning if the deprecated tag 'allowDangerousHTML' is used
  if (settings.allowDangerousHTML !== undefined && !deprecationWarningIssued$1) {
    deprecationWarningIssued$1 = true;
    console.warn(
      'mdast-util-to-hast: deprecation: `allowDangerousHTML` is nonstandard, use `allowDangerousHtml` instead'
    );
  }

  var dangerous = settings.allowDangerousHtml || settings.allowDangerousHTML;
  var footnoteById = {};

  h.dangerous = dangerous;
  h.definition = definitions(tree);
  h.footnoteById = footnoteById;
  h.footnoteOrder = [];
  h.augment = augment;
  h.handlers = Object.assign({}, handlers$1, settings.handlers);
  h.unknownHandler = settings.unknownHandler;
  h.passThrough = settings.passThrough;

  visit(tree, 'footnoteDefinition', onfootnotedefinition);

  return h

  // Finalise the created `right`, a hast node, from `left`, an mdast node.
  function augment(left, right) {
    var data;
    var ctx;

    // Handle `data.hName`, `data.hProperties, `data.hChildren`.
    if (left && left.data) {
      data = left.data;

      if (data.hName) {
        if (right.type !== 'element') {
          right = {
            type: 'element',
            tagName: '',
            properties: {},
            children: []
          };
        }

        right.tagName = data.hName;
      }

      if (right.type === 'element' && data.hProperties) {
        right.properties = Object.assign({}, right.properties, data.hProperties);
      }

      if (right.children && data.hChildren) {
        right.children = data.hChildren;
      }
    }

    ctx = left && left.position ? left : {position: left};

    if (!generated(ctx)) {
      right.position = {
        start: position.start(ctx),
        end: position.end(ctx)
      };
    }

    return right
  }

  // Create an element for `node`.
  function h(node, tagName, props, children) {
    if (
      (children === undefined || children === null) &&
      typeof props === 'object' &&
      'length' in props
    ) {
      children = props;
      props = {};
    }

    return augment(node, {
      type: 'element',
      tagName: tagName,
      properties: props || {},
      children: children || []
    })
  }

  function onfootnotedefinition(definition) {
    var id = String(definition.identifier).toUpperCase();

    // Mimick CM behavior of link definitions.
    // See: <https://github.com/syntax-tree/mdast-util-definitions/blob/8290999/index.js#L26>.
    if (!own$5.call(footnoteById, id)) {
      footnoteById[id] = definition;
    }
  }
}

// Transform `tree`, which is an mdast node, to a hast node.
function toHast(tree, options) {
  var h = factory$2(tree, options);
  var node = one$3(h, tree);
  var foot = footer(h);

  if (foot) {
    node.children = node.children.concat(u('text', '\n'), foot);
  }

  return node
}

var mdastUtilToHast = lib$2;

var immutable = extend;

var hasOwnProperty$1 = Object.prototype.hasOwnProperty;

function extend() {
    var target = {};

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
            if (hasOwnProperty$1.call(source, key)) {
                target[key] = source[key];
            }
        }
    }

    return target
}

var schema$1 = Schema$2;

var proto$1 = Schema$2.prototype;

proto$1.space = null;
proto$1.normal = {};
proto$1.property = {};

function Schema$2(property, normal, space) {
  this.property = property;
  this.normal = normal;

  if (space) {
    this.space = space;
  }
}

var xtend$5 = immutable;
var Schema$1 = schema$1;

var merge_1 = merge$2;

function merge$2(definitions) {
  var length = definitions.length;
  var property = [];
  var normal = [];
  var index = -1;
  var info;
  var space;

  while (++index < length) {
    info = definitions[index];
    property.push(info.property);
    normal.push(info.normal);
    space = info.space;
  }

  return new Schema$1(
    xtend$5.apply(null, property),
    xtend$5.apply(null, normal),
    space
  )
}

var normalize_1 = normalize$3;

function normalize$3(value) {
  return value.toLowerCase()
}

var info = Info$2;

var proto = Info$2.prototype;

proto.space = null;
proto.attribute = null;
proto.property = null;
proto.boolean = false;
proto.booleanish = false;
proto.overloadedBoolean = false;
proto.number = false;
proto.commaSeparated = false;
proto.spaceSeparated = false;
proto.commaOrSpaceSeparated = false;
proto.mustUseProperty = false;
proto.defined = false;

function Info$2(property, attribute) {
  this.property = property;
  this.attribute = attribute;
}

var types$4 = {};

var powers = 0;

types$4.boolean = increment();
types$4.booleanish = increment();
types$4.overloadedBoolean = increment();
types$4.number = increment();
types$4.spaceSeparated = increment();
types$4.commaSeparated = increment();
types$4.commaOrSpaceSeparated = increment();

function increment() {
  return Math.pow(2, ++powers)
}

var Info$1 = info;
var types$3 = types$4;

var definedInfo = DefinedInfo$2;

DefinedInfo$2.prototype = new Info$1();
DefinedInfo$2.prototype.defined = true;

var checks = [
  'boolean',
  'booleanish',
  'overloadedBoolean',
  'number',
  'commaSeparated',
  'spaceSeparated',
  'commaOrSpaceSeparated'
];
var checksLength = checks.length;

function DefinedInfo$2(property, attribute, mask, space) {
  var index = -1;
  var check;

  mark(this, 'space', space);

  Info$1.call(this, property, attribute);

  while (++index < checksLength) {
    check = checks[index];
    mark(this, check, (mask & types$3[check]) === types$3[check]);
  }
}

function mark(values, key, value) {
  if (value) {
    values[key] = value;
  }
}

var normalize$2 = normalize_1;
var Schema = schema$1;
var DefinedInfo$1 = definedInfo;

var create_1 = create$6;

function create$6(definition) {
  var space = definition.space;
  var mustUseProperty = definition.mustUseProperty || [];
  var attributes = definition.attributes || {};
  var props = definition.properties;
  var transform = definition.transform;
  var property = {};
  var normal = {};
  var prop;
  var info;

  for (prop in props) {
    info = new DefinedInfo$1(
      prop,
      transform(attributes, prop),
      props[prop],
      space
    );

    if (mustUseProperty.indexOf(prop) !== -1) {
      info.mustUseProperty = true;
    }

    property[prop] = info;

    normal[normalize$2(prop)] = prop;
    normal[normalize$2(info.attribute)] = prop;
  }

  return new Schema(property, normal, space)
}

var create$5 = create_1;

var xlink$2 = create$5({
  space: 'xlink',
  transform: xlinkTransform,
  properties: {
    xLinkActuate: null,
    xLinkArcRole: null,
    xLinkHref: null,
    xLinkRole: null,
    xLinkShow: null,
    xLinkTitle: null,
    xLinkType: null
  }
});

function xlinkTransform(_, prop) {
  return 'xlink:' + prop.slice(5).toLowerCase()
}

var create$4 = create_1;

var xml$2 = create$4({
  space: 'xml',
  transform: xmlTransform,
  properties: {
    xmlLang: null,
    xmlBase: null,
    xmlSpace: null
  }
});

function xmlTransform(_, prop) {
  return 'xml:' + prop.slice(3).toLowerCase()
}

var caseSensitiveTransform_1 = caseSensitiveTransform$2;

function caseSensitiveTransform$2(attributes, attribute) {
  return attribute in attributes ? attributes[attribute] : attribute
}

var caseSensitiveTransform$1 = caseSensitiveTransform_1;

var caseInsensitiveTransform_1 = caseInsensitiveTransform$2;

function caseInsensitiveTransform$2(attributes, property) {
  return caseSensitiveTransform$1(attributes, property.toLowerCase())
}

var create$3 = create_1;
var caseInsensitiveTransform$1 = caseInsensitiveTransform_1;

var xmlns$2 = create$3({
  space: 'xmlns',
  attributes: {
    xmlnsxlink: 'xmlns:xlink'
  },
  transform: caseInsensitiveTransform$1,
  properties: {
    xmlns: null,
    xmlnsXLink: null
  }
});

var types$2 = types$4;
var create$2 = create_1;

var booleanish$1 = types$2.booleanish;
var number$2 = types$2.number;
var spaceSeparated$2 = types$2.spaceSeparated;

var aria$2 = create$2({
  transform: ariaTransform,
  properties: {
    ariaActiveDescendant: null,
    ariaAtomic: booleanish$1,
    ariaAutoComplete: null,
    ariaBusy: booleanish$1,
    ariaChecked: booleanish$1,
    ariaColCount: number$2,
    ariaColIndex: number$2,
    ariaColSpan: number$2,
    ariaControls: spaceSeparated$2,
    ariaCurrent: null,
    ariaDescribedBy: spaceSeparated$2,
    ariaDetails: null,
    ariaDisabled: booleanish$1,
    ariaDropEffect: spaceSeparated$2,
    ariaErrorMessage: null,
    ariaExpanded: booleanish$1,
    ariaFlowTo: spaceSeparated$2,
    ariaGrabbed: booleanish$1,
    ariaHasPopup: null,
    ariaHidden: booleanish$1,
    ariaInvalid: null,
    ariaKeyShortcuts: null,
    ariaLabel: null,
    ariaLabelledBy: spaceSeparated$2,
    ariaLevel: number$2,
    ariaLive: null,
    ariaModal: booleanish$1,
    ariaMultiLine: booleanish$1,
    ariaMultiSelectable: booleanish$1,
    ariaOrientation: null,
    ariaOwns: spaceSeparated$2,
    ariaPlaceholder: null,
    ariaPosInSet: number$2,
    ariaPressed: booleanish$1,
    ariaReadOnly: booleanish$1,
    ariaRelevant: null,
    ariaRequired: booleanish$1,
    ariaRoleDescription: spaceSeparated$2,
    ariaRowCount: number$2,
    ariaRowIndex: number$2,
    ariaRowSpan: number$2,
    ariaSelected: booleanish$1,
    ariaSetSize: number$2,
    ariaSort: null,
    ariaValueMax: number$2,
    ariaValueMin: number$2,
    ariaValueNow: number$2,
    ariaValueText: null,
    role: null
  }
});

function ariaTransform(_, prop) {
  return prop === 'role' ? prop : 'aria-' + prop.slice(4).toLowerCase()
}

var types$1 = types$4;
var create$1 = create_1;
var caseInsensitiveTransform = caseInsensitiveTransform_1;

var boolean$1 = types$1.boolean;
var overloadedBoolean = types$1.overloadedBoolean;
var booleanish = types$1.booleanish;
var number$1 = types$1.number;
var spaceSeparated$1 = types$1.spaceSeparated;
var commaSeparated$1 = types$1.commaSeparated;

var html$5 = create$1({
  space: 'html',
  attributes: {
    acceptcharset: 'accept-charset',
    classname: 'class',
    htmlfor: 'for',
    httpequiv: 'http-equiv'
  },
  transform: caseInsensitiveTransform,
  mustUseProperty: ['checked', 'multiple', 'muted', 'selected'],
  properties: {
    // Standard Properties.
    abbr: null,
    accept: commaSeparated$1,
    acceptCharset: spaceSeparated$1,
    accessKey: spaceSeparated$1,
    action: null,
    allow: null,
    allowFullScreen: boolean$1,
    allowPaymentRequest: boolean$1,
    allowUserMedia: boolean$1,
    alt: null,
    as: null,
    async: boolean$1,
    autoCapitalize: null,
    autoComplete: spaceSeparated$1,
    autoFocus: boolean$1,
    autoPlay: boolean$1,
    capture: boolean$1,
    charSet: null,
    checked: boolean$1,
    cite: null,
    className: spaceSeparated$1,
    cols: number$1,
    colSpan: null,
    content: null,
    contentEditable: booleanish,
    controls: boolean$1,
    controlsList: spaceSeparated$1,
    coords: number$1 | commaSeparated$1,
    crossOrigin: null,
    data: null,
    dateTime: null,
    decoding: null,
    default: boolean$1,
    defer: boolean$1,
    dir: null,
    dirName: null,
    disabled: boolean$1,
    download: overloadedBoolean,
    draggable: booleanish,
    encType: null,
    enterKeyHint: null,
    form: null,
    formAction: null,
    formEncType: null,
    formMethod: null,
    formNoValidate: boolean$1,
    formTarget: null,
    headers: spaceSeparated$1,
    height: number$1,
    hidden: boolean$1,
    high: number$1,
    href: null,
    hrefLang: null,
    htmlFor: spaceSeparated$1,
    httpEquiv: spaceSeparated$1,
    id: null,
    imageSizes: null,
    imageSrcSet: commaSeparated$1,
    inputMode: null,
    integrity: null,
    is: null,
    isMap: boolean$1,
    itemId: null,
    itemProp: spaceSeparated$1,
    itemRef: spaceSeparated$1,
    itemScope: boolean$1,
    itemType: spaceSeparated$1,
    kind: null,
    label: null,
    lang: null,
    language: null,
    list: null,
    loading: null,
    loop: boolean$1,
    low: number$1,
    manifest: null,
    max: null,
    maxLength: number$1,
    media: null,
    method: null,
    min: null,
    minLength: number$1,
    multiple: boolean$1,
    muted: boolean$1,
    name: null,
    nonce: null,
    noModule: boolean$1,
    noValidate: boolean$1,
    onAbort: null,
    onAfterPrint: null,
    onAuxClick: null,
    onBeforePrint: null,
    onBeforeUnload: null,
    onBlur: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onContextMenu: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFormData: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLanguageChange: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadEnd: null,
    onLoadStart: null,
    onMessage: null,
    onMessageError: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRejectionHandled: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onSecurityPolicyViolation: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onSlotChange: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnhandledRejection: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onWheel: null,
    open: boolean$1,
    optimum: number$1,
    pattern: null,
    ping: spaceSeparated$1,
    placeholder: null,
    playsInline: boolean$1,
    poster: null,
    preload: null,
    readOnly: boolean$1,
    referrerPolicy: null,
    rel: spaceSeparated$1,
    required: boolean$1,
    reversed: boolean$1,
    rows: number$1,
    rowSpan: number$1,
    sandbox: spaceSeparated$1,
    scope: null,
    scoped: boolean$1,
    seamless: boolean$1,
    selected: boolean$1,
    shape: null,
    size: number$1,
    sizes: null,
    slot: null,
    span: number$1,
    spellCheck: booleanish,
    src: null,
    srcDoc: null,
    srcLang: null,
    srcSet: commaSeparated$1,
    start: number$1,
    step: null,
    style: null,
    tabIndex: number$1,
    target: null,
    title: null,
    translate: null,
    type: null,
    typeMustMatch: boolean$1,
    useMap: null,
    value: booleanish,
    width: number$1,
    wrap: null,

    // Legacy.
    // See: https://html.spec.whatwg.org/#other-elements,-attributes-and-apis
    align: null, // Several. Use CSS `text-align` instead,
    aLink: null, // `<body>`. Use CSS `a:active {color}` instead
    archive: spaceSeparated$1, // `<object>`. List of URIs to archives
    axis: null, // `<td>` and `<th>`. Use `scope` on `<th>`
    background: null, // `<body>`. Use CSS `background-image` instead
    bgColor: null, // `<body>` and table elements. Use CSS `background-color` instead
    border: number$1, // `<table>`. Use CSS `border-width` instead,
    borderColor: null, // `<table>`. Use CSS `border-color` instead,
    bottomMargin: number$1, // `<body>`
    cellPadding: null, // `<table>`
    cellSpacing: null, // `<table>`
    char: null, // Several table elements. When `align=char`, sets the character to align on
    charOff: null, // Several table elements. When `char`, offsets the alignment
    classId: null, // `<object>`
    clear: null, // `<br>`. Use CSS `clear` instead
    code: null, // `<object>`
    codeBase: null, // `<object>`
    codeType: null, // `<object>`
    color: null, // `<font>` and `<hr>`. Use CSS instead
    compact: boolean$1, // Lists. Use CSS to reduce space between items instead
    declare: boolean$1, // `<object>`
    event: null, // `<script>`
    face: null, // `<font>`. Use CSS instead
    frame: null, // `<table>`
    frameBorder: null, // `<iframe>`. Use CSS `border` instead
    hSpace: number$1, // `<img>` and `<object>`
    leftMargin: number$1, // `<body>`
    link: null, // `<body>`. Use CSS `a:link {color: *}` instead
    longDesc: null, // `<frame>`, `<iframe>`, and `<img>`. Use an `<a>`
    lowSrc: null, // `<img>`. Use a `<picture>`
    marginHeight: number$1, // `<body>`
    marginWidth: number$1, // `<body>`
    noResize: boolean$1, // `<frame>`
    noHref: boolean$1, // `<area>`. Use no href instead of an explicit `nohref`
    noShade: boolean$1, // `<hr>`. Use background-color and height instead of borders
    noWrap: boolean$1, // `<td>` and `<th>`
    object: null, // `<applet>`
    profile: null, // `<head>`
    prompt: null, // `<isindex>`
    rev: null, // `<link>`
    rightMargin: number$1, // `<body>`
    rules: null, // `<table>`
    scheme: null, // `<meta>`
    scrolling: booleanish, // `<frame>`. Use overflow in the child context
    standby: null, // `<object>`
    summary: null, // `<table>`
    text: null, // `<body>`. Use CSS `color` instead
    topMargin: number$1, // `<body>`
    valueType: null, // `<param>`
    version: null, // `<html>`. Use a doctype.
    vAlign: null, // Several. Use CSS `vertical-align` instead
    vLink: null, // `<body>`. Use CSS `a:visited {color}` instead
    vSpace: number$1, // `<img>` and `<object>`

    // Non-standard Properties.
    allowTransparency: null,
    autoCorrect: null,
    autoSave: null,
    disablePictureInPicture: boolean$1,
    disableRemotePlayback: boolean$1,
    prefix: null,
    property: null,
    results: number$1,
    security: null,
    unselectable: null
  }
});

var merge$1 = merge_1;
var xlink$1 = xlink$2;
var xml$1 = xml$2;
var xmlns$1 = xmlns$2;
var aria$1 = aria$2;
var html$4 = html$5;

var html_1$1 = merge$1([xml$1, xlink$1, xmlns$1, aria$1, html$4]);

var normalize$1 = normalize_1;
var DefinedInfo = definedInfo;
var Info = info;

var data = 'data';

var find_1 = find$2;

var valid = /^data[-\w.:]+$/i;
var dash = /-[a-z]/g;
var cap$1 = /[A-Z]/g;

function find$2(schema, value) {
  var normal = normalize$1(value);
  var prop = value;
  var Type = Info;

  if (normal in schema.normal) {
    return schema.property[schema.normal[normal]]
  }

  if (normal.length > 4 && normal.slice(0, 4) === data && valid.test(value)) {
    // Attribute or property.
    if (value.charAt(4) === '-') {
      prop = datasetToProperty(value);
    } else {
      value = datasetToAttribute(value);
    }

    Type = DefinedInfo;
  }

  return new Type(prop, value)
}

function datasetToProperty(attribute) {
  var value = attribute.slice(5).replace(dash, camelcase);
  return data + value.charAt(0).toUpperCase() + value.slice(1)
}

function datasetToAttribute(property) {
  var value = property.slice(4);

  if (dash.test(value)) {
    return property
  }

  value = value.replace(cap$1, kebab);

  if (value.charAt(0) !== '-') {
    value = '-' + value;
  }

  return data + value
}

function kebab($0) {
  return '-' + $0.toLowerCase()
}

function camelcase($0) {
  return $0.charAt(1).toUpperCase()
}

var hastUtilParseSelector = parse$2;

var search = /[#.]/g;

// Create a hast element from a simple CSS selector.
function parse$2(selector, defaultTagName) {
  var value = selector || '';
  var name = defaultTagName || 'div';
  var props = {};
  var start = 0;
  var subvalue;
  var previous;
  var match;

  while (start < value.length) {
    search.lastIndex = start;
    match = search.exec(value);
    subvalue = value.slice(start, match ? match.index : value.length);

    if (subvalue) {
      if (!previous) {
        name = subvalue;
      } else if (previous === '#') {
        props.id = subvalue;
      } else if (props.className) {
        props.className.push(subvalue);
      } else {
        props.className = [subvalue];
      }

      start += subvalue.length;
    }

    if (match) {
      previous = match[0];
      start++;
    }
  }

  return {type: 'element', tagName: name, properties: props, children: []}
}

var spaceSeparatedTokens = {};

spaceSeparatedTokens.parse = parse$1;
spaceSeparatedTokens.stringify = stringify$1;

var empty$2 = '';
var space$1 = ' ';
var whiteSpace$2 = /[ \t\n\r\f]+/g;

function parse$1(value) {
  var input = String(value || empty$2).trim();
  return input === empty$2 ? [] : input.split(whiteSpace$2)
}

function stringify$1(values) {
  return values.join(space$1).trim()
}

var commaSeparatedTokens = {};

commaSeparatedTokens.parse = parse;
commaSeparatedTokens.stringify = stringify;

var comma = ',';
var space = ' ';
var empty$1 = '';

// Parse comma-separated tokens to an array.
function parse(value) {
  var values = [];
  var input = String(value || empty$1);
  var index = input.indexOf(comma);
  var lastIndex = 0;
  var end = false;
  var val;

  while (!end) {
    if (index === -1) {
      index = input.length;
      end = true;
    }

    val = input.slice(lastIndex, index).trim();

    if (val || !end) {
      values.push(val);
    }

    lastIndex = index + 1;
    index = input.indexOf(comma, lastIndex);
  }

  return values
}

// Compile an array to comma-separated tokens.
// `options.padLeft` (default: `true`) pads a space left of each token, and
// `options.padRight` (default: `false`) pads a space to the right of each token.
function stringify(values, options) {
  var settings = options || {};
  var left = settings.padLeft === false ? empty$1 : space;
  var right = settings.padRight ? space : empty$1;

  // Ensure the last empty entry is seen.
  if (values[values.length - 1] === empty$1) {
    values = values.concat(empty$1);
  }

  return values.join(right + comma + left).trim()
}

var find$1 = find_1;
var normalize = normalize_1;
var parseSelector = hastUtilParseSelector;
var spaces$1 = spaceSeparatedTokens.parse;
var commas$1 = commaSeparatedTokens.parse;

var factory_1 = factory$1;

var own$4 = {}.hasOwnProperty;

function factory$1(schema, defaultTagName, caseSensitive) {
  var adjust = caseSensitive ? createAdjustMap(caseSensitive) : null;

  return h

  // Hyperscript compatible DSL for creating virtual hast trees.
  function h(selector, properties) {
    var node = parseSelector(selector, defaultTagName);
    var children = Array.prototype.slice.call(arguments, 2);
    var name = node.tagName.toLowerCase();
    var property;

    node.tagName = adjust && own$4.call(adjust, name) ? adjust[name] : name;

    if (properties && isChildren(properties, node)) {
      children.unshift(properties);
      properties = null;
    }

    if (properties) {
      for (property in properties) {
        addProperty(node.properties, property, properties[property]);
      }
    }

    addChild(node.children, children);

    if (node.tagName === 'template') {
      node.content = {type: 'root', children: node.children};
      node.children = [];
    }

    return node
  }

  function addProperty(properties, key, value) {
    var info;
    var property;
    var result;

    // Ignore nully and NaN values.
    if (value === null || value === undefined || value !== value) {
      return
    }

    info = find$1(schema, key);
    property = info.property;
    result = value;

    // Handle list values.
    if (typeof result === 'string') {
      if (info.spaceSeparated) {
        result = spaces$1(result);
      } else if (info.commaSeparated) {
        result = commas$1(result);
      } else if (info.commaOrSpaceSeparated) {
        result = spaces$1(commas$1(result).join(' '));
      }
    }

    // Accept `object` on style.
    if (property === 'style' && typeof value !== 'string') {
      result = style(result);
    }

    // Class-names (which can be added both on the `selector` and here).
    if (property === 'className' && properties.className) {
      result = properties.className.concat(result);
    }

    properties[property] = parsePrimitives(info, property, result);
  }
}

function isChildren(value, node) {
  return (
    typeof value === 'string' ||
    'length' in value ||
    isNode(node.tagName, value)
  )
}

function isNode(tagName, value) {
  var type = value.type;

  if (tagName === 'input' || !type || typeof type !== 'string') {
    return false
  }

  if (typeof value.children === 'object' && 'length' in value.children) {
    return true
  }

  type = type.toLowerCase();

  if (tagName === 'button') {
    return (
      type !== 'menu' &&
      type !== 'submit' &&
      type !== 'reset' &&
      type !== 'button'
    )
  }

  return 'value' in value
}

function addChild(nodes, value) {
  var index;
  var length;

  if (typeof value === 'string' || typeof value === 'number') {
    nodes.push({type: 'text', value: String(value)});
    return
  }

  if (typeof value === 'object' && 'length' in value) {
    index = -1;
    length = value.length;

    while (++index < length) {
      addChild(nodes, value[index]);
    }

    return
  }

  if (typeof value !== 'object' || !('type' in value)) {
    throw new Error('Expected node, nodes, or string, got `' + value + '`')
  }

  nodes.push(value);
}

// Parse a (list of) primitives.
function parsePrimitives(info, name, value) {
  var index;
  var length;
  var result;

  if (typeof value !== 'object' || !('length' in value)) {
    return parsePrimitive(info, name, value)
  }

  length = value.length;
  index = -1;
  result = [];

  while (++index < length) {
    result[index] = parsePrimitive(info, name, value[index]);
  }

  return result
}

// Parse a single primitives.
function parsePrimitive(info, name, value) {
  var result = value;

  if (info.number || info.positiveNumber) {
    if (!isNaN(result) && result !== '') {
      result = Number(result);
    }
  } else if (info.boolean || info.overloadedBoolean) {
    // Accept `boolean` and `string`.
    if (
      typeof result === 'string' &&
      (result === '' || normalize(value) === normalize(name))
    ) {
      result = true;
    }
  }

  return result
}

function style(value) {
  var result = [];
  var key;

  for (key in value) {
    result.push([key, value[key]].join(': '));
  }

  return result.join('; ')
}

function createAdjustMap(values) {
  var length = values.length;
  var index = -1;
  var result = {};
  var value;

  while (++index < length) {
    value = values[index];
    result[value.toLowerCase()] = value;
  }

  return result
}

var schema = html_1$1;
var factory = factory_1;

var html$3 = factory(schema, 'div');
html$3.displayName = 'html';

var html_1 = html$3;

var hastscript = html_1;

var convert_1 = convert$4;

function convert$4(test) {
  if (typeof test === 'string') {
    return tagNameFactory(test)
  }

  if (test === null || test === undefined) {
    return element$3
  }

  if (typeof test === 'object') {
    return any(test)
  }

  if (typeof test === 'function') {
    return callFactory(test)
  }

  throw new Error('Expected function, string, or array as test')
}

function convertAll(tests) {
  var length = tests.length;
  var index = -1;
  var results = [];

  while (++index < length) {
    results[index] = convert$4(tests[index]);
  }

  return results
}

function any(tests) {
  var checks = convertAll(tests);
  var length = checks.length;

  return matches

  function matches() {
    var index = -1;

    while (++index < length) {
      if (checks[index].apply(this, arguments)) {
        return true
      }
    }

    return false
  }
}

// Utility to convert a string a tag name check.
function tagNameFactory(test) {
  return tagName

  function tagName(node) {
    return element$3(node) && node.tagName === test
  }
}

// Utility to convert a function check.
function callFactory(test) {
  return call

  function call(node) {
    return element$3(node) && Boolean(test.apply(this, arguments))
  }
}

// Utility to return true if this is an element.
function element$3(node) {
  return (
    node &&
    typeof node === 'object' &&
    node.type === 'element' &&
    typeof node.tagName === 'string'
  )
}

var convert$3 = convert_1;

var hastUtilIsElement = isElement;

isElement.convert = convert$3;

// Check if if `node` is an `element` and whether it passes the given test.
function isElement(node, test, index, parent, context) {
  var hasParent = parent !== null && parent !== undefined;
  var hasIndex = index !== null && index !== undefined;
  var check = convert$3(test);

  if (
    hasIndex &&
    (typeof index !== 'number' || index < 0 || index === Infinity)
  ) {
    throw new Error('Expected positive finite index for child node')
  }

  if (hasParent && (!parent.type || !parent.children)) {
    throw new Error('Expected parent node')
  }

  if (!node || !node.type || typeof node.type !== 'string') {
    return false
  }

  if (hasParent !== hasIndex) {
    throw new Error('Expected both parent and index')
  }

  return check.call(context, node, index, parent)
}

var convert$2 = convert_1;

var hastUtilEmbedded = convert$2([
  'audio',
  'canvas',
  'embed',
  'iframe',
  'img',
  'math',
  'object',
  'picture',
  'svg',
  'video'
]);

var hastUtilWhitespace = interElementWhiteSpace;

// HTML white-space expression.
// See <https://html.spec.whatwg.org/#space-character>.
var re = /[ \t\n\f\r]/g;

function interElementWhiteSpace(node) {
  var value;

  if (node && typeof node === 'object' && node.type === 'text') {
    value = node.value || '';
  } else if (typeof node === 'string') {
    value = node;
  } else {
    return false
  }

  return value.replace(re, '') === ''
}

var own$3 = {}.hasOwnProperty;

var hastUtilHasProperty = hasProperty;

// Check if `node` has a set `name` property.
function hasProperty(node, name) {
  var props;
  var value;

  if (!node || !name || typeof node !== 'object' || node.type !== 'element') {
    return false
  }

  props = node.properties;
  value = props && own$3.call(props, name) && props[name];

  return value !== null && value !== undefined && value !== false
}

/**
 * @fileoverview
 *   Check if a `link` element is “Body OK”.
 * @longdescription
 *   ## Use
 *
 *   ```js
 *   var h = require('hastscript')
 *   var ok = require('hast-util-is-body-ok-link')
 *
 *   ok(h('link', {itemProp: 'foo'})) //=> true
 *   ok(h('link', {rel: ['stylesheet'], href: 'index.css'})) //=> true
 *   ok(h('link', {rel: ['author'], href: 'index.css'})) //=> false
 *   ```
 *
 *   ## API
 *
 *   ### `isBodyOkLink(node)`
 *
 *   * Return `true` for `link` elements with an `itemProp`
 *   * Return `true` for `link` elements with a `rel` list where one or more
 *     entries are `pingback`, `prefetch`, or `stylesheet`.
 */

var is$1 = hastUtilIsElement;
var has$1 = hastUtilHasProperty;

var hastUtilIsBodyOkLink = ok;

var list$1 = ['pingback', 'prefetch', 'stylesheet'];

function ok(node) {
  var length;
  var index;
  var rel;

  if (!is$1(node, 'link')) {
    return false
  }

  if (has$1(node, 'itemProp')) {
    return true
  }

  rel = (node.properties || {}).rel || [];
  length = rel.length;
  index = -1;

  if (rel.length === 0) {
    return false
  }

  while (++index < length) {
    if (list$1.indexOf(rel[index]) === -1) {
      return false
    }
  }

  return true
}

var is = hastUtilIsElement;
var has = hastUtilHasProperty;
var embedded = hastUtilEmbedded;
var bodyOKLink = hastUtilIsBodyOkLink;

var hastUtilPhrasing = phrasing;

var list = [
  'a',
  'abbr',
  // `area` is in fact only phrasing if it is inside a `map` element.
  // However, since `area`s are required to be inside a `map` element, and it’s
  // a rather involved check, it’s ignored here for now.
  'area',
  'b',
  'bdi',
  'bdo',
  'br',
  'button',
  'cite',
  'code',
  'data',
  'datalist',
  'del',
  'dfn',
  'em',
  'i',
  'input',
  'ins',
  'kbd',
  'keygen',
  'label',
  'map',
  'mark',
  'meter',
  'noscript',
  'output',
  'progress',
  'q',
  'ruby',
  's',
  'samp',
  'script',
  'select',
  'small',
  'span',
  'strong',
  'sub',
  'sup',
  'template',
  'textarea',
  'time',
  'u',
  'var',
  'wbr'
];

function phrasing(node) {
  return (
    node.type === 'text' ||
    is(node, list) ||
    embedded(node) ||
    bodyOKLink(node) ||
    (is(node, 'meta') && has(node, 'itemProp'))
  )
}

var types = types$4;
var create = create_1;
var caseSensitiveTransform = caseSensitiveTransform_1;

var boolean = types.boolean;
var number = types.number;
var spaceSeparated = types.spaceSeparated;
var commaSeparated = types.commaSeparated;
var commaOrSpaceSeparated = types.commaOrSpaceSeparated;

var svg$3 = create({
  space: 'svg',
  attributes: {
    accentHeight: 'accent-height',
    alignmentBaseline: 'alignment-baseline',
    arabicForm: 'arabic-form',
    baselineShift: 'baseline-shift',
    capHeight: 'cap-height',
    className: 'class',
    clipPath: 'clip-path',
    clipRule: 'clip-rule',
    colorInterpolation: 'color-interpolation',
    colorInterpolationFilters: 'color-interpolation-filters',
    colorProfile: 'color-profile',
    colorRendering: 'color-rendering',
    crossOrigin: 'crossorigin',
    dataType: 'datatype',
    dominantBaseline: 'dominant-baseline',
    enableBackground: 'enable-background',
    fillOpacity: 'fill-opacity',
    fillRule: 'fill-rule',
    floodColor: 'flood-color',
    floodOpacity: 'flood-opacity',
    fontFamily: 'font-family',
    fontSize: 'font-size',
    fontSizeAdjust: 'font-size-adjust',
    fontStretch: 'font-stretch',
    fontStyle: 'font-style',
    fontVariant: 'font-variant',
    fontWeight: 'font-weight',
    glyphName: 'glyph-name',
    glyphOrientationHorizontal: 'glyph-orientation-horizontal',
    glyphOrientationVertical: 'glyph-orientation-vertical',
    hrefLang: 'hreflang',
    horizAdvX: 'horiz-adv-x',
    horizOriginX: 'horiz-origin-x',
    horizOriginY: 'horiz-origin-y',
    imageRendering: 'image-rendering',
    letterSpacing: 'letter-spacing',
    lightingColor: 'lighting-color',
    markerEnd: 'marker-end',
    markerMid: 'marker-mid',
    markerStart: 'marker-start',
    navDown: 'nav-down',
    navDownLeft: 'nav-down-left',
    navDownRight: 'nav-down-right',
    navLeft: 'nav-left',
    navNext: 'nav-next',
    navPrev: 'nav-prev',
    navRight: 'nav-right',
    navUp: 'nav-up',
    navUpLeft: 'nav-up-left',
    navUpRight: 'nav-up-right',
    onAbort: 'onabort',
    onActivate: 'onactivate',
    onAfterPrint: 'onafterprint',
    onBeforePrint: 'onbeforeprint',
    onBegin: 'onbegin',
    onCancel: 'oncancel',
    onCanPlay: 'oncanplay',
    onCanPlayThrough: 'oncanplaythrough',
    onChange: 'onchange',
    onClick: 'onclick',
    onClose: 'onclose',
    onCopy: 'oncopy',
    onCueChange: 'oncuechange',
    onCut: 'oncut',
    onDblClick: 'ondblclick',
    onDrag: 'ondrag',
    onDragEnd: 'ondragend',
    onDragEnter: 'ondragenter',
    onDragExit: 'ondragexit',
    onDragLeave: 'ondragleave',
    onDragOver: 'ondragover',
    onDragStart: 'ondragstart',
    onDrop: 'ondrop',
    onDurationChange: 'ondurationchange',
    onEmptied: 'onemptied',
    onEnd: 'onend',
    onEnded: 'onended',
    onError: 'onerror',
    onFocus: 'onfocus',
    onFocusIn: 'onfocusin',
    onFocusOut: 'onfocusout',
    onHashChange: 'onhashchange',
    onInput: 'oninput',
    onInvalid: 'oninvalid',
    onKeyDown: 'onkeydown',
    onKeyPress: 'onkeypress',
    onKeyUp: 'onkeyup',
    onLoad: 'onload',
    onLoadedData: 'onloadeddata',
    onLoadedMetadata: 'onloadedmetadata',
    onLoadStart: 'onloadstart',
    onMessage: 'onmessage',
    onMouseDown: 'onmousedown',
    onMouseEnter: 'onmouseenter',
    onMouseLeave: 'onmouseleave',
    onMouseMove: 'onmousemove',
    onMouseOut: 'onmouseout',
    onMouseOver: 'onmouseover',
    onMouseUp: 'onmouseup',
    onMouseWheel: 'onmousewheel',
    onOffline: 'onoffline',
    onOnline: 'ononline',
    onPageHide: 'onpagehide',
    onPageShow: 'onpageshow',
    onPaste: 'onpaste',
    onPause: 'onpause',
    onPlay: 'onplay',
    onPlaying: 'onplaying',
    onPopState: 'onpopstate',
    onProgress: 'onprogress',
    onRateChange: 'onratechange',
    onRepeat: 'onrepeat',
    onReset: 'onreset',
    onResize: 'onresize',
    onScroll: 'onscroll',
    onSeeked: 'onseeked',
    onSeeking: 'onseeking',
    onSelect: 'onselect',
    onShow: 'onshow',
    onStalled: 'onstalled',
    onStorage: 'onstorage',
    onSubmit: 'onsubmit',
    onSuspend: 'onsuspend',
    onTimeUpdate: 'ontimeupdate',
    onToggle: 'ontoggle',
    onUnload: 'onunload',
    onVolumeChange: 'onvolumechange',
    onWaiting: 'onwaiting',
    onZoom: 'onzoom',
    overlinePosition: 'overline-position',
    overlineThickness: 'overline-thickness',
    paintOrder: 'paint-order',
    panose1: 'panose-1',
    pointerEvents: 'pointer-events',
    referrerPolicy: 'referrerpolicy',
    renderingIntent: 'rendering-intent',
    shapeRendering: 'shape-rendering',
    stopColor: 'stop-color',
    stopOpacity: 'stop-opacity',
    strikethroughPosition: 'strikethrough-position',
    strikethroughThickness: 'strikethrough-thickness',
    strokeDashArray: 'stroke-dasharray',
    strokeDashOffset: 'stroke-dashoffset',
    strokeLineCap: 'stroke-linecap',
    strokeLineJoin: 'stroke-linejoin',
    strokeMiterLimit: 'stroke-miterlimit',
    strokeOpacity: 'stroke-opacity',
    strokeWidth: 'stroke-width',
    tabIndex: 'tabindex',
    textAnchor: 'text-anchor',
    textDecoration: 'text-decoration',
    textRendering: 'text-rendering',
    typeOf: 'typeof',
    underlinePosition: 'underline-position',
    underlineThickness: 'underline-thickness',
    unicodeBidi: 'unicode-bidi',
    unicodeRange: 'unicode-range',
    unitsPerEm: 'units-per-em',
    vAlphabetic: 'v-alphabetic',
    vHanging: 'v-hanging',
    vIdeographic: 'v-ideographic',
    vMathematical: 'v-mathematical',
    vectorEffect: 'vector-effect',
    vertAdvY: 'vert-adv-y',
    vertOriginX: 'vert-origin-x',
    vertOriginY: 'vert-origin-y',
    wordSpacing: 'word-spacing',
    writingMode: 'writing-mode',
    xHeight: 'x-height',
    // These were camelcased in Tiny. Now lowercased in SVG 2
    playbackOrder: 'playbackorder',
    timelineBegin: 'timelinebegin'
  },
  transform: caseSensitiveTransform,
  properties: {
    about: commaOrSpaceSeparated,
    accentHeight: number,
    accumulate: null,
    additive: null,
    alignmentBaseline: null,
    alphabetic: number,
    amplitude: number,
    arabicForm: null,
    ascent: number,
    attributeName: null,
    attributeType: null,
    azimuth: number,
    bandwidth: null,
    baselineShift: null,
    baseFrequency: null,
    baseProfile: null,
    bbox: null,
    begin: null,
    bias: number,
    by: null,
    calcMode: null,
    capHeight: number,
    className: spaceSeparated,
    clip: null,
    clipPath: null,
    clipPathUnits: null,
    clipRule: null,
    color: null,
    colorInterpolation: null,
    colorInterpolationFilters: null,
    colorProfile: null,
    colorRendering: null,
    content: null,
    contentScriptType: null,
    contentStyleType: null,
    crossOrigin: null,
    cursor: null,
    cx: null,
    cy: null,
    d: null,
    dataType: null,
    defaultAction: null,
    descent: number,
    diffuseConstant: number,
    direction: null,
    display: null,
    dur: null,
    divisor: number,
    dominantBaseline: null,
    download: boolean,
    dx: null,
    dy: null,
    edgeMode: null,
    editable: null,
    elevation: number,
    enableBackground: null,
    end: null,
    event: null,
    exponent: number,
    externalResourcesRequired: null,
    fill: null,
    fillOpacity: number,
    fillRule: null,
    filter: null,
    filterRes: null,
    filterUnits: null,
    floodColor: null,
    floodOpacity: null,
    focusable: null,
    focusHighlight: null,
    fontFamily: null,
    fontSize: null,
    fontSizeAdjust: null,
    fontStretch: null,
    fontStyle: null,
    fontVariant: null,
    fontWeight: null,
    format: null,
    fr: null,
    from: null,
    fx: null,
    fy: null,
    g1: commaSeparated,
    g2: commaSeparated,
    glyphName: commaSeparated,
    glyphOrientationHorizontal: null,
    glyphOrientationVertical: null,
    glyphRef: null,
    gradientTransform: null,
    gradientUnits: null,
    handler: null,
    hanging: number,
    hatchContentUnits: null,
    hatchUnits: null,
    height: null,
    href: null,
    hrefLang: null,
    horizAdvX: number,
    horizOriginX: number,
    horizOriginY: number,
    id: null,
    ideographic: number,
    imageRendering: null,
    initialVisibility: null,
    in: null,
    in2: null,
    intercept: number,
    k: number,
    k1: number,
    k2: number,
    k3: number,
    k4: number,
    kernelMatrix: commaOrSpaceSeparated,
    kernelUnitLength: null,
    keyPoints: null, // SEMI_COLON_SEPARATED
    keySplines: null, // SEMI_COLON_SEPARATED
    keyTimes: null, // SEMI_COLON_SEPARATED
    kerning: null,
    lang: null,
    lengthAdjust: null,
    letterSpacing: null,
    lightingColor: null,
    limitingConeAngle: number,
    local: null,
    markerEnd: null,
    markerMid: null,
    markerStart: null,
    markerHeight: null,
    markerUnits: null,
    markerWidth: null,
    mask: null,
    maskContentUnits: null,
    maskUnits: null,
    mathematical: null,
    max: null,
    media: null,
    mediaCharacterEncoding: null,
    mediaContentEncodings: null,
    mediaSize: number,
    mediaTime: null,
    method: null,
    min: null,
    mode: null,
    name: null,
    navDown: null,
    navDownLeft: null,
    navDownRight: null,
    navLeft: null,
    navNext: null,
    navPrev: null,
    navRight: null,
    navUp: null,
    navUpLeft: null,
    navUpRight: null,
    numOctaves: null,
    observer: null,
    offset: null,
    onAbort: null,
    onActivate: null,
    onAfterPrint: null,
    onBeforePrint: null,
    onBegin: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnd: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFocusIn: null,
    onFocusOut: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadStart: null,
    onMessage: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onMouseWheel: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRepeat: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onShow: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onZoom: null,
    opacity: null,
    operator: null,
    order: null,
    orient: null,
    orientation: null,
    origin: null,
    overflow: null,
    overlay: null,
    overlinePosition: number,
    overlineThickness: number,
    paintOrder: null,
    panose1: null,
    path: null,
    pathLength: number,
    patternContentUnits: null,
    patternTransform: null,
    patternUnits: null,
    phase: null,
    ping: spaceSeparated,
    pitch: null,
    playbackOrder: null,
    pointerEvents: null,
    points: null,
    pointsAtX: number,
    pointsAtY: number,
    pointsAtZ: number,
    preserveAlpha: null,
    preserveAspectRatio: null,
    primitiveUnits: null,
    propagate: null,
    property: commaOrSpaceSeparated,
    r: null,
    radius: null,
    referrerPolicy: null,
    refX: null,
    refY: null,
    rel: commaOrSpaceSeparated,
    rev: commaOrSpaceSeparated,
    renderingIntent: null,
    repeatCount: null,
    repeatDur: null,
    requiredExtensions: commaOrSpaceSeparated,
    requiredFeatures: commaOrSpaceSeparated,
    requiredFonts: commaOrSpaceSeparated,
    requiredFormats: commaOrSpaceSeparated,
    resource: null,
    restart: null,
    result: null,
    rotate: null,
    rx: null,
    ry: null,
    scale: null,
    seed: null,
    shapeRendering: null,
    side: null,
    slope: null,
    snapshotTime: null,
    specularConstant: number,
    specularExponent: number,
    spreadMethod: null,
    spacing: null,
    startOffset: null,
    stdDeviation: null,
    stemh: null,
    stemv: null,
    stitchTiles: null,
    stopColor: null,
    stopOpacity: null,
    strikethroughPosition: number,
    strikethroughThickness: number,
    string: null,
    stroke: null,
    strokeDashArray: commaOrSpaceSeparated,
    strokeDashOffset: null,
    strokeLineCap: null,
    strokeLineJoin: null,
    strokeMiterLimit: number,
    strokeOpacity: number,
    strokeWidth: null,
    style: null,
    surfaceScale: number,
    syncBehavior: null,
    syncBehaviorDefault: null,
    syncMaster: null,
    syncTolerance: null,
    syncToleranceDefault: null,
    systemLanguage: commaOrSpaceSeparated,
    tabIndex: number,
    tableValues: null,
    target: null,
    targetX: number,
    targetY: number,
    textAnchor: null,
    textDecoration: null,
    textRendering: null,
    textLength: null,
    timelineBegin: null,
    title: null,
    transformBehavior: null,
    type: null,
    typeOf: commaOrSpaceSeparated,
    to: null,
    transform: null,
    u1: null,
    u2: null,
    underlinePosition: number,
    underlineThickness: number,
    unicode: null,
    unicodeBidi: null,
    unicodeRange: null,
    unitsPerEm: number,
    values: null,
    vAlphabetic: number,
    vMathematical: number,
    vectorEffect: null,
    vHanging: number,
    vIdeographic: number,
    version: null,
    vertAdvY: number,
    vertOriginX: number,
    vertOriginY: number,
    viewBox: null,
    viewTarget: null,
    visibility: null,
    width: null,
    widths: null,
    wordSpacing: null,
    writingMode: null,
    x: null,
    x1: null,
    x2: null,
    xChannelSelector: null,
    xHeight: number,
    y: null,
    y1: null,
    y2: null,
    yChannelSelector: null,
    z: null,
    zoomAndPan: null
  }
});

var merge = merge_1;
var xlink = xlink$2;
var xml = xml$2;
var xmlns = xmlns$2;
var aria = aria$2;
var svg$2 = svg$3;

var svg_1 = merge([xml, xlink, xmlns, aria, svg$2]);

var require$$2 = [
	"area",
	"base",
	"basefont",
	"bgsound",
	"br",
	"col",
	"command",
	"embed",
	"frame",
	"hr",
	"image",
	"img",
	"input",
	"isindex",
	"keygen",
	"link",
	"menuitem",
	"meta",
	"nextid",
	"param",
	"source",
	"track",
	"wbr"
];

var omission$4 = {};

var siblings$3 = {};

var whiteSpace$1 = hastUtilWhitespace;

siblings$3.before = siblings$2(-1);
siblings$3.after = siblings$2(1);

// Factory to check siblings in a direction.
function siblings$2(increment) {
  return sibling

  // Find applicable siblings in a direction.
  function sibling(parent, index, includeWhiteSpace) {
    var siblings = parent && parent.children;
    var offset = index + increment;
    var next = siblings && siblings[offset];

    if (!includeWhiteSpace) {
      while (next && whiteSpace$1(next)) {
        offset += increment;
        next = siblings[offset];
      }
    }

    return next
  }
}

var convert$1 = convert_1$1;
var whiteSpace = hastUtilWhitespace;

var whiteSpaceStart_1 = whiteSpaceStart$2;

var isText = convert$1('text');

// Check if `node` starts with white-space.
function whiteSpaceStart$2(node) {
  return isText(node) && whiteSpace(node.value.charAt(0))
}

var convert = convert_1$1;

var comment$3 = convert('comment');

var omission_1 = omission$3;

var own$2 = {}.hasOwnProperty;

// Factory to check if a given node can have a tag omitted.
function omission$3(handlers) {
  return omit

  // Check if a given node can have a tag omitted.
  function omit(node, index, parent) {
    return (
      own$2.call(handlers, node.tagName) &&
      handlers[node.tagName](node, index, parent)
    )
  }
}

var element$2 = hastUtilIsElement;
var whiteSpaceStart$1 = whiteSpaceStart_1;
var comment$2 = comment$3;
var siblings$1 = siblings$3;
var omission$2 = omission_1;

var closing$1 = omission$2({
  html: html$2,
  head: headOrColgroupOrCaption,
  body: body$1,
  p: p,
  li: li,
  dt: dt,
  dd: dd,
  rt: rubyElement,
  rp: rubyElement,
  optgroup: optgroup,
  option: option,
  menuitem: menuitem,
  colgroup: headOrColgroupOrCaption,
  caption: headOrColgroupOrCaption,
  thead: thead,
  tbody: tbody$1,
  tfoot: tfoot,
  tr: tr,
  td: cells,
  th: cells
});

// Macro for `</head>`, `</colgroup>`, and `</caption>`.
function headOrColgroupOrCaption(node, index, parent) {
  var next = siblings$1.after(parent, index, true);
  return !next || (!comment$2(next) && !whiteSpaceStart$1(next))
}

// Whether to omit `</html>`.
function html$2(node, index, parent) {
  var next = siblings$1.after(parent, index);
  return !next || !comment$2(next)
}

// Whether to omit `</body>`.
function body$1(node, index, parent) {
  var next = siblings$1.after(parent, index);
  return !next || !comment$2(next)
}

// Whether to omit `</p>`.
function p(node, index, parent) {
  var next = siblings$1.after(parent, index);
  return next
    ? element$2(next, [
        'address',
        'article',
        'aside',
        'blockquote',
        'details',
        'div',
        'dl',
        'fieldset',
        'figcaption',
        'figure',
        'footer',
        'form',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'header',
        'hgroup',
        'hr',
        'main',
        'menu',
        'nav',
        'ol',
        'p',
        'pre',
        'section',
        'table',
        'ul'
      ])
    : !parent ||
        // Confusing parent.
        !element$2(parent, [
          'a',
          'audio',
          'del',
          'ins',
          'map',
          'noscript',
          'video'
        ])
}

// Whether to omit `</li>`.
function li(node, index, parent) {
  var next = siblings$1.after(parent, index);
  return !next || element$2(next, 'li')
}

// Whether to omit `</dt>`.
function dt(node, index, parent) {
  var next = siblings$1.after(parent, index);
  return next && element$2(next, ['dt', 'dd'])
}

// Whether to omit `</dd>`.
function dd(node, index, parent) {
  var next = siblings$1.after(parent, index);
  return !next || element$2(next, ['dt', 'dd'])
}

// Whether to omit `</rt>` or `</rp>`.
function rubyElement(node, index, parent) {
  var next = siblings$1.after(parent, index);
  return !next || element$2(next, ['rp', 'rt'])
}

// Whether to omit `</optgroup>`.
function optgroup(node, index, parent) {
  var next = siblings$1.after(parent, index);
  return !next || element$2(next, 'optgroup')
}

// Whether to omit `</option>`.
function option(node, index, parent) {
  var next = siblings$1.after(parent, index);
  return !next || element$2(next, ['option', 'optgroup'])
}

// Whether to omit `</menuitem>`.
function menuitem(node, index, parent) {
  var next = siblings$1.after(parent, index);
  return !next || element$2(next, ['menuitem', 'hr', 'menu'])
}

// Whether to omit `</thead>`.
function thead(node, index, parent) {
  var next = siblings$1.after(parent, index);
  return next && element$2(next, ['tbody', 'tfoot'])
}

// Whether to omit `</tbody>`.
function tbody$1(node, index, parent) {
  var next = siblings$1.after(parent, index);
  return !next || element$2(next, ['tbody', 'tfoot'])
}

// Whether to omit `</tfoot>`.
function tfoot(node, index, parent) {
  return !siblings$1.after(parent, index)
}

// Whether to omit `</tr>`.
function tr(node, index, parent) {
  var next = siblings$1.after(parent, index);
  return !next || element$2(next, 'tr')
}

// Whether to omit `</td>` or `</th>`.
function cells(node, index, parent) {
  var next = siblings$1.after(parent, index);
  return !next || element$2(next, ['td', 'th'])
}

var element$1 = hastUtilIsElement;
var siblings = siblings$3;
var whiteSpaceStart = whiteSpaceStart_1;
var comment$1 = comment$3;
var closing = closing$1;
var omission$1 = omission_1;

var opening = omission$1({
  html: html$1,
  head: head,
  body: body,
  colgroup: colgroup,
  tbody: tbody
});

// Whether to omit `<html>`.
function html$1(node) {
  var head = siblings.after(node, -1);
  return !head || !comment$1(head)
}

// Whether to omit `<head>`.
function head(node) {
  var children = node.children;
  var seen = [];
  var index = -1;

  while (++index < children.length) {
    if (element$1(children[index], ['title', 'base'])) {
      if (seen.indexOf(children[index].tagName) > -1) return false
      seen.push(children[index].tagName);
    }
  }

  return children.length
}

// Whether to omit `<body>`.
function body(node) {
  var head = siblings.after(node, -1, true);

  return (
    !head ||
    (!comment$1(head) &&
      !whiteSpaceStart(head) &&
      !element$1(head, ['meta', 'link', 'script', 'style', 'template']))
  )
}

// Whether to omit `<colgroup>`.
// The spec describes some logic for the opening tag, but it’s easier to
// implement in the closing tag, to the same effect, so we handle it there
// instead.
function colgroup(node, index, parent) {
  var previous = siblings.before(parent, index);
  var head = siblings.after(node, -1, true);

  // Previous colgroup was already omitted.
  if (
    element$1(previous, 'colgroup') &&
    closing(previous, parent.children.indexOf(previous), parent)
  ) {
    return false
  }

  return head && element$1(head, 'col')
}

// Whether to omit `<tbody>`.
function tbody(node, index, parent) {
  var previous = siblings.before(parent, index);
  var head = siblings.after(node, -1);

  // Previous table section was already omitted.
  if (
    element$1(previous, ['thead', 'tbody']) &&
    closing(previous, parent.children.indexOf(previous), parent)
  ) {
    return false
  }

  return head && element$1(head, 'tr')
}

omission$4.opening = opening;
omission$4.closing = closing$1;

var core$2 = encode$2;

// Encode special characters in `value`.
function encode$2(value, options) {
  value = value.replace(
    options.subset ? charactersToExpression(options.subset) : /["&'<>`]/g,
    basic
  );

  if (options.subset || options.escapeOnly) {
    return value
  }

  return (
    value
      // Surrogate pairs.
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, surrogate)
      // BMP control characters (C0 except for LF, CR, SP; DEL; and some more
      // non-ASCII ones).
      .replace(
        // eslint-disable-next-line no-control-regex, unicorn/no-hex-escape
        /[\x01-\t\v\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g,
        basic
      )
  )

  function surrogate(pair, index, all) {
    return options.format(
      (pair.charCodeAt(0) - 0xd800) * 0x400 +
        pair.charCodeAt(1) -
        0xdc00 +
        0x10000,
      all.charCodeAt(index + 2),
      options
    )
  }

  function basic(character, index, all) {
    return options.format(
      character.charCodeAt(0),
      all.charCodeAt(index + 1),
      options
    )
  }
}

function charactersToExpression(subset) {
  var groups = [];
  var index = -1;

  while (++index < subset.length) {
    groups.push(subset[index].replace(/[|\\{}()[\]^$+*?.]/g, '\\$&'));
  }

  return new RegExp('(?:' + groups.join('|') + ')', 'g')
}

var fromCharCode$3 = String.fromCharCode;

var toHexadecimal$1 = toHexReference;

var fromCharCode$2 = fromCharCode$3;

// Transform `code` into a hexadecimal character reference.
function toHexReference(code, next, omit) {
  var value = '&#x' + code.toString(16).toUpperCase();
  return omit && next && !/[\dA-Fa-f]/.test(fromCharCode$2(next))
    ? value
    : value + ';'
}

var toDecimal$1 = toDecimalReference;

var fromCharCode$1 = fromCharCode$3;

// Transform `code` into a decimal character reference.
function toDecimalReference(code, next, omit) {
  var value = '&#' + String(code);
  return omit && next && !/\d/.test(fromCharCode$1(next)) ? value : value + ';'
}

var AElig$1 = "Æ";
var AMP = "&";
var Aacute$1 = "Á";
var Acirc$1 = "Â";
var Agrave$1 = "À";
var Aring$1 = "Å";
var Atilde$1 = "Ã";
var Auml$1 = "Ä";
var COPY = "©";
var Ccedil$1 = "Ç";
var ETH$1 = "Ð";
var Eacute$1 = "É";
var Ecirc$1 = "Ê";
var Egrave$1 = "È";
var Euml$1 = "Ë";
var GT = ">";
var Iacute$1 = "Í";
var Icirc$1 = "Î";
var Igrave$1 = "Ì";
var Iuml$1 = "Ï";
var LT = "<";
var Ntilde$1 = "Ñ";
var Oacute$1 = "Ó";
var Ocirc$1 = "Ô";
var Ograve$1 = "Ò";
var Oslash$1 = "Ø";
var Otilde$1 = "Õ";
var Ouml$1 = "Ö";
var QUOT = "\"";
var REG = "®";
var THORN$1 = "Þ";
var Uacute$1 = "Ú";
var Ucirc$1 = "Û";
var Ugrave$1 = "Ù";
var Uuml$1 = "Ü";
var Yacute$1 = "Ý";
var aacute$1 = "á";
var acirc$1 = "â";
var acute$1 = "´";
var aelig$1 = "æ";
var agrave$1 = "à";
var amp$1 = "&";
var aring$1 = "å";
var atilde$1 = "ã";
var auml$1 = "ä";
var brvbar$1 = "¦";
var ccedil$1 = "ç";
var cedil$1 = "¸";
var cent$1 = "¢";
var copy$1 = "©";
var curren$1 = "¤";
var deg$1 = "°";
var divide$1 = "÷";
var eacute$1 = "é";
var ecirc$1 = "ê";
var egrave$1 = "è";
var eth$1 = "ð";
var euml$1 = "ë";
var frac12$1 = "½";
var frac14$1 = "¼";
var frac34$1 = "¾";
var gt$1 = ">";
var iacute$1 = "í";
var icirc$1 = "î";
var iexcl$1 = "¡";
var igrave$1 = "ì";
var iquest$1 = "¿";
var iuml$1 = "ï";
var laquo$1 = "«";
var lt$1 = "<";
var macr$1 = "¯";
var micro$1 = "µ";
var middot$1 = "·";
var nbsp$1 = " ";
var not$1 = "¬";
var ntilde$1 = "ñ";
var oacute$1 = "ó";
var ocirc$1 = "ô";
var ograve$1 = "ò";
var ordf$1 = "ª";
var ordm$1 = "º";
var oslash$1 = "ø";
var otilde$1 = "õ";
var ouml$1 = "ö";
var para$1 = "¶";
var plusmn$1 = "±";
var pound$1 = "£";
var quot$1 = "\"";
var raquo$1 = "»";
var reg$1 = "®";
var sect$1 = "§";
var shy$1 = "­";
var sup1$1 = "¹";
var sup2$1 = "²";
var sup3$1 = "³";
var szlig$1 = "ß";
var thorn$1 = "þ";
var times$1 = "×";
var uacute$1 = "ú";
var ucirc$1 = "û";
var ugrave$1 = "ù";
var uml$1 = "¨";
var uuml$1 = "ü";
var yacute$1 = "ý";
var yen$1 = "¥";
var yuml$1 = "ÿ";
var require$$0$1 = {
	AElig: AElig$1,
	AMP: AMP,
	Aacute: Aacute$1,
	Acirc: Acirc$1,
	Agrave: Agrave$1,
	Aring: Aring$1,
	Atilde: Atilde$1,
	Auml: Auml$1,
	COPY: COPY,
	Ccedil: Ccedil$1,
	ETH: ETH$1,
	Eacute: Eacute$1,
	Ecirc: Ecirc$1,
	Egrave: Egrave$1,
	Euml: Euml$1,
	GT: GT,
	Iacute: Iacute$1,
	Icirc: Icirc$1,
	Igrave: Igrave$1,
	Iuml: Iuml$1,
	LT: LT,
	Ntilde: Ntilde$1,
	Oacute: Oacute$1,
	Ocirc: Ocirc$1,
	Ograve: Ograve$1,
	Oslash: Oslash$1,
	Otilde: Otilde$1,
	Ouml: Ouml$1,
	QUOT: QUOT,
	REG: REG,
	THORN: THORN$1,
	Uacute: Uacute$1,
	Ucirc: Ucirc$1,
	Ugrave: Ugrave$1,
	Uuml: Uuml$1,
	Yacute: Yacute$1,
	aacute: aacute$1,
	acirc: acirc$1,
	acute: acute$1,
	aelig: aelig$1,
	agrave: agrave$1,
	amp: amp$1,
	aring: aring$1,
	atilde: atilde$1,
	auml: auml$1,
	brvbar: brvbar$1,
	ccedil: ccedil$1,
	cedil: cedil$1,
	cent: cent$1,
	copy: copy$1,
	curren: curren$1,
	deg: deg$1,
	divide: divide$1,
	eacute: eacute$1,
	ecirc: ecirc$1,
	egrave: egrave$1,
	eth: eth$1,
	euml: euml$1,
	frac12: frac12$1,
	frac14: frac14$1,
	frac34: frac34$1,
	gt: gt$1,
	iacute: iacute$1,
	icirc: icirc$1,
	iexcl: iexcl$1,
	igrave: igrave$1,
	iquest: iquest$1,
	iuml: iuml$1,
	laquo: laquo$1,
	lt: lt$1,
	macr: macr$1,
	micro: micro$1,
	middot: middot$1,
	nbsp: nbsp$1,
	not: not$1,
	ntilde: ntilde$1,
	oacute: oacute$1,
	ocirc: ocirc$1,
	ograve: ograve$1,
	ordf: ordf$1,
	ordm: ordm$1,
	oslash: oslash$1,
	otilde: otilde$1,
	ouml: ouml$1,
	para: para$1,
	plusmn: plusmn$1,
	pound: pound$1,
	quot: quot$1,
	raquo: raquo$1,
	reg: reg$1,
	sect: sect$1,
	shy: shy$1,
	sup1: sup1$1,
	sup2: sup2$1,
	sup3: sup3$1,
	szlig: szlig$1,
	thorn: thorn$1,
	times: times$1,
	uacute: uacute$1,
	ucirc: ucirc$1,
	ugrave: ugrave$1,
	uml: uml$1,
	uuml: uuml$1,
	yacute: yacute$1,
	yen: yen$1,
	yuml: yuml$1
};

var nbsp = " ";
var iexcl = "¡";
var cent = "¢";
var pound = "£";
var curren = "¤";
var yen = "¥";
var brvbar = "¦";
var sect = "§";
var uml = "¨";
var copy = "©";
var ordf = "ª";
var laquo = "«";
var not = "¬";
var shy = "­";
var reg = "®";
var macr = "¯";
var deg = "°";
var plusmn = "±";
var sup2 = "²";
var sup3 = "³";
var acute = "´";
var micro = "µ";
var para = "¶";
var middot = "·";
var cedil = "¸";
var sup1 = "¹";
var ordm = "º";
var raquo = "»";
var frac14 = "¼";
var frac12 = "½";
var frac34 = "¾";
var iquest = "¿";
var Agrave = "À";
var Aacute = "Á";
var Acirc = "Â";
var Atilde = "Ã";
var Auml = "Ä";
var Aring = "Å";
var AElig = "Æ";
var Ccedil = "Ç";
var Egrave = "È";
var Eacute = "É";
var Ecirc = "Ê";
var Euml = "Ë";
var Igrave = "Ì";
var Iacute = "Í";
var Icirc = "Î";
var Iuml = "Ï";
var ETH = "Ð";
var Ntilde = "Ñ";
var Ograve = "Ò";
var Oacute = "Ó";
var Ocirc = "Ô";
var Otilde = "Õ";
var Ouml = "Ö";
var times = "×";
var Oslash = "Ø";
var Ugrave = "Ù";
var Uacute = "Ú";
var Ucirc = "Û";
var Uuml = "Ü";
var Yacute = "Ý";
var THORN = "Þ";
var szlig = "ß";
var agrave = "à";
var aacute = "á";
var acirc = "â";
var atilde = "ã";
var auml = "ä";
var aring = "å";
var aelig = "æ";
var ccedil = "ç";
var egrave = "è";
var eacute = "é";
var ecirc = "ê";
var euml = "ë";
var igrave = "ì";
var iacute = "í";
var icirc = "î";
var iuml = "ï";
var eth = "ð";
var ntilde = "ñ";
var ograve = "ò";
var oacute = "ó";
var ocirc = "ô";
var otilde = "õ";
var ouml = "ö";
var divide = "÷";
var oslash = "ø";
var ugrave = "ù";
var uacute = "ú";
var ucirc = "û";
var uuml = "ü";
var yacute = "ý";
var thorn = "þ";
var yuml = "ÿ";
var fnof = "ƒ";
var Alpha = "Α";
var Beta = "Β";
var Gamma = "Γ";
var Delta = "Δ";
var Epsilon = "Ε";
var Zeta = "Ζ";
var Eta = "Η";
var Theta = "Θ";
var Iota = "Ι";
var Kappa = "Κ";
var Lambda = "Λ";
var Mu = "Μ";
var Nu = "Ν";
var Xi = "Ξ";
var Omicron = "Ο";
var Pi = "Π";
var Rho = "Ρ";
var Sigma = "Σ";
var Tau = "Τ";
var Upsilon = "Υ";
var Phi = "Φ";
var Chi = "Χ";
var Psi = "Ψ";
var Omega = "Ω";
var alpha = "α";
var beta = "β";
var gamma = "γ";
var delta = "δ";
var epsilon = "ε";
var zeta = "ζ";
var eta = "η";
var theta = "θ";
var iota = "ι";
var kappa = "κ";
var lambda = "λ";
var mu = "μ";
var nu = "ν";
var xi = "ξ";
var omicron = "ο";
var pi = "π";
var rho = "ρ";
var sigmaf = "ς";
var sigma = "σ";
var tau = "τ";
var upsilon = "υ";
var phi = "φ";
var chi = "χ";
var psi = "ψ";
var omega = "ω";
var thetasym = "ϑ";
var upsih = "ϒ";
var piv = "ϖ";
var bull = "•";
var hellip = "…";
var prime = "′";
var Prime = "″";
var oline = "‾";
var frasl = "⁄";
var weierp = "℘";
var image = "ℑ";
var real = "ℜ";
var trade = "™";
var alefsym = "ℵ";
var larr = "←";
var uarr = "↑";
var rarr = "→";
var darr = "↓";
var harr = "↔";
var crarr = "↵";
var lArr = "⇐";
var uArr = "⇑";
var rArr = "⇒";
var dArr = "⇓";
var hArr = "⇔";
var forall = "∀";
var part = "∂";
var exist = "∃";
var empty = "∅";
var nabla = "∇";
var isin = "∈";
var notin = "∉";
var ni = "∋";
var prod = "∏";
var sum = "∑";
var minus = "−";
var lowast = "∗";
var radic = "√";
var prop = "∝";
var infin = "∞";
var ang = "∠";
var and = "∧";
var or = "∨";
var cap = "∩";
var cup = "∪";
var int = "∫";
var there4 = "∴";
var sim = "∼";
var cong = "≅";
var asymp = "≈";
var ne = "≠";
var equiv = "≡";
var le = "≤";
var ge = "≥";
var sub = "⊂";
var sup = "⊃";
var nsub = "⊄";
var sube = "⊆";
var supe = "⊇";
var oplus = "⊕";
var otimes = "⊗";
var perp = "⊥";
var sdot = "⋅";
var lceil = "⌈";
var rceil = "⌉";
var lfloor = "⌊";
var rfloor = "⌋";
var lang = "〈";
var rang = "〉";
var loz = "◊";
var spades = "♠";
var clubs = "♣";
var hearts = "♥";
var diams = "♦";
var quot = "\"";
var amp = "&";
var lt = "<";
var gt = ">";
var OElig = "Œ";
var oelig = "œ";
var Scaron = "Š";
var scaron = "š";
var Yuml = "Ÿ";
var circ = "ˆ";
var tilde = "˜";
var ensp = " ";
var emsp = " ";
var thinsp = " ";
var zwnj = "‌";
var zwj = "‍";
var lrm = "‎";
var rlm = "‏";
var ndash = "–";
var mdash = "—";
var lsquo = "‘";
var rsquo = "’";
var sbquo = "‚";
var ldquo = "“";
var rdquo = "”";
var bdquo = "„";
var dagger = "†";
var Dagger = "‡";
var permil = "‰";
var lsaquo = "‹";
var rsaquo = "›";
var euro = "€";
var require$$0 = {
	nbsp: nbsp,
	iexcl: iexcl,
	cent: cent,
	pound: pound,
	curren: curren,
	yen: yen,
	brvbar: brvbar,
	sect: sect,
	uml: uml,
	copy: copy,
	ordf: ordf,
	laquo: laquo,
	not: not,
	shy: shy,
	reg: reg,
	macr: macr,
	deg: deg,
	plusmn: plusmn,
	sup2: sup2,
	sup3: sup3,
	acute: acute,
	micro: micro,
	para: para,
	middot: middot,
	cedil: cedil,
	sup1: sup1,
	ordm: ordm,
	raquo: raquo,
	frac14: frac14,
	frac12: frac12,
	frac34: frac34,
	iquest: iquest,
	Agrave: Agrave,
	Aacute: Aacute,
	Acirc: Acirc,
	Atilde: Atilde,
	Auml: Auml,
	Aring: Aring,
	AElig: AElig,
	Ccedil: Ccedil,
	Egrave: Egrave,
	Eacute: Eacute,
	Ecirc: Ecirc,
	Euml: Euml,
	Igrave: Igrave,
	Iacute: Iacute,
	Icirc: Icirc,
	Iuml: Iuml,
	ETH: ETH,
	Ntilde: Ntilde,
	Ograve: Ograve,
	Oacute: Oacute,
	Ocirc: Ocirc,
	Otilde: Otilde,
	Ouml: Ouml,
	times: times,
	Oslash: Oslash,
	Ugrave: Ugrave,
	Uacute: Uacute,
	Ucirc: Ucirc,
	Uuml: Uuml,
	Yacute: Yacute,
	THORN: THORN,
	szlig: szlig,
	agrave: agrave,
	aacute: aacute,
	acirc: acirc,
	atilde: atilde,
	auml: auml,
	aring: aring,
	aelig: aelig,
	ccedil: ccedil,
	egrave: egrave,
	eacute: eacute,
	ecirc: ecirc,
	euml: euml,
	igrave: igrave,
	iacute: iacute,
	icirc: icirc,
	iuml: iuml,
	eth: eth,
	ntilde: ntilde,
	ograve: ograve,
	oacute: oacute,
	ocirc: ocirc,
	otilde: otilde,
	ouml: ouml,
	divide: divide,
	oslash: oslash,
	ugrave: ugrave,
	uacute: uacute,
	ucirc: ucirc,
	uuml: uuml,
	yacute: yacute,
	thorn: thorn,
	yuml: yuml,
	fnof: fnof,
	Alpha: Alpha,
	Beta: Beta,
	Gamma: Gamma,
	Delta: Delta,
	Epsilon: Epsilon,
	Zeta: Zeta,
	Eta: Eta,
	Theta: Theta,
	Iota: Iota,
	Kappa: Kappa,
	Lambda: Lambda,
	Mu: Mu,
	Nu: Nu,
	Xi: Xi,
	Omicron: Omicron,
	Pi: Pi,
	Rho: Rho,
	Sigma: Sigma,
	Tau: Tau,
	Upsilon: Upsilon,
	Phi: Phi,
	Chi: Chi,
	Psi: Psi,
	Omega: Omega,
	alpha: alpha,
	beta: beta,
	gamma: gamma,
	delta: delta,
	epsilon: epsilon,
	zeta: zeta,
	eta: eta,
	theta: theta,
	iota: iota,
	kappa: kappa,
	lambda: lambda,
	mu: mu,
	nu: nu,
	xi: xi,
	omicron: omicron,
	pi: pi,
	rho: rho,
	sigmaf: sigmaf,
	sigma: sigma,
	tau: tau,
	upsilon: upsilon,
	phi: phi,
	chi: chi,
	psi: psi,
	omega: omega,
	thetasym: thetasym,
	upsih: upsih,
	piv: piv,
	bull: bull,
	hellip: hellip,
	prime: prime,
	Prime: Prime,
	oline: oline,
	frasl: frasl,
	weierp: weierp,
	image: image,
	real: real,
	trade: trade,
	alefsym: alefsym,
	larr: larr,
	uarr: uarr,
	rarr: rarr,
	darr: darr,
	harr: harr,
	crarr: crarr,
	lArr: lArr,
	uArr: uArr,
	rArr: rArr,
	dArr: dArr,
	hArr: hArr,
	forall: forall,
	part: part,
	exist: exist,
	empty: empty,
	nabla: nabla,
	isin: isin,
	notin: notin,
	ni: ni,
	prod: prod,
	sum: sum,
	minus: minus,
	lowast: lowast,
	radic: radic,
	prop: prop,
	infin: infin,
	ang: ang,
	and: and,
	or: or,
	cap: cap,
	cup: cup,
	int: int,
	there4: there4,
	sim: sim,
	cong: cong,
	asymp: asymp,
	ne: ne,
	equiv: equiv,
	le: le,
	ge: ge,
	sub: sub,
	sup: sup,
	nsub: nsub,
	sube: sube,
	supe: supe,
	oplus: oplus,
	otimes: otimes,
	perp: perp,
	sdot: sdot,
	lceil: lceil,
	rceil: rceil,
	lfloor: lfloor,
	rfloor: rfloor,
	lang: lang,
	rang: rang,
	loz: loz,
	spades: spades,
	clubs: clubs,
	hearts: hearts,
	diams: diams,
	quot: quot,
	amp: amp,
	lt: lt,
	gt: gt,
	OElig: OElig,
	oelig: oelig,
	Scaron: Scaron,
	scaron: scaron,
	Yuml: Yuml,
	circ: circ,
	tilde: tilde,
	ensp: ensp,
	emsp: emsp,
	thinsp: thinsp,
	zwnj: zwnj,
	zwj: zwj,
	lrm: lrm,
	rlm: rlm,
	ndash: ndash,
	mdash: mdash,
	lsquo: lsquo,
	rsquo: rsquo,
	sbquo: sbquo,
	ldquo: ldquo,
	rdquo: rdquo,
	bdquo: bdquo,
	dagger: dagger,
	Dagger: Dagger,
	permil: permil,
	lsaquo: lsaquo,
	rsaquo: rsaquo,
	euro: euro
};

var entities$4 = require$$0;

var characters$1 = {};
var name;

var characters_1 = characters$1;

for (name in entities$4) {
  characters$1[entities$4[name]] = name;
}

var hasOwnProperty = {}.hasOwnProperty;

var require$$4 = [
	"cent",
	"copy",
	"divide",
	"gt",
	"lt",
	"not",
	"para",
	"times"
];

var toNamed_1 = toNamed$1;

var legacy = require$$0$1;
var characters = characters_1;
var fromCharCode = fromCharCode$3;
var own$1 = hasOwnProperty;
var dangerous = require$$4;

// Transform `code` into a named character reference.
function toNamed$1(code, next, omit, attribute) {
  var character = fromCharCode(code);
  var name;
  var value;

  if (own$1.call(characters, character)) {
    name = characters[character];
    value = '&' + name;

    if (
      omit &&
      own$1.call(legacy, name) &&
      dangerous.indexOf(name) === -1 &&
      (!attribute ||
        (next && next !== 61 /* `=` */ && /[^\da-z]/i.test(fromCharCode(next))))
    ) {
      return value
    }

    return value + ';'
  }

  return ''
}

var formatSmart = formatPretty;

var toHexadecimal = toHexadecimal$1;
var toDecimal = toDecimal$1;
var toNamed = toNamed_1;

// Encode `character` according to `options`.
function formatPretty(code, next, options) {
  var named;
  var numeric;
  var decimal;

  if (options.useNamedReferences || options.useShortestReferences) {
    named = toNamed(
      code,
      next,
      options.omitOptionalSemicolons,
      options.attribute
    );
  }

  if (options.useShortestReferences || !named) {
    numeric = toHexadecimal(code, next, options.omitOptionalSemicolons);

    // Use the shortest numeric reference when requested.
    // A simple algorithm would use decimal for all code points under 100, as
    // those are shorter than hexadecimal:
    //
    // * `&#99;` vs `&#x63;` (decimal shorter)
    // * `&#100;` vs `&#x64;` (equal)
    //
    // However, because we take `next` into consideration when `omit` is used,
    // And it would be possible that decimals are shorter on bigger values as
    // well if `next` is hexadecimal but not decimal, we instead compare both.
    if (options.useShortestReferences) {
      decimal = toDecimal(code, next, options.omitOptionalSemicolons);

      if (decimal.length < numeric.length) {
        numeric = decimal;
      }
    }
  }

  return named &&
    (!options.useShortestReferences || named.length < numeric.length)
    ? named
    : numeric
}

var xtend$4 = immutable;
var core$1 = core$2;
var smart$1 = formatSmart;

var encode_1 = encode$1;

// Encode special characters in `value`.
function encode$1(value, options) {
  // Note: Switch to `Object.assign` next major.
  return core$1(value, xtend$4(options, {format: smart$1}))
}

var core = core$2;
var smart = formatSmart;

var _escape = escape$1;

// Shortcut to escape special characters in HTML.
function escape$1(value) {
  return core(value, {
    escapeOnly: true,
    useNamedReferences: true,
    format: smart
  })
}

var encode = encode_1;
var escape = _escape;

var lib$1 = encode;
encode.escape = escape;

var stringifyEntities = lib$1;

var xtend$3 = immutable;
var entities$3 = stringifyEntities;

var comment = serializeComment;

function serializeComment(ctx, node) {
  // See: <https://html.spec.whatwg.org/multipage/syntax.html#comments>
  return ctx.bogusComments
    ? '<?' + entities$3(node.value, xtend$3(ctx.entities, {subset: ['>']})) + '>'
    : '<!--' + node.value.replace(/^>|^->|<!--|-->|--!>|<!-$/g, encode) + '-->'

  function encode($0) {
    return entities$3($0, xtend$3(ctx.entities, {subset: ['<', '>']}))
  }
}

var ccount_1 = ccount$2;

function ccount$2(source, character) {
  var value = String(source);
  var count = 0;
  var index;

  if (typeof character !== 'string') {
    throw new Error('Expected character')
  }

  index = value.indexOf(character);

  while (index !== -1) {
    count++;
    index = value.indexOf(character, index + character.length);
  }

  return count
}

var xtend$2 = immutable;
var ccount$1 = ccount_1;
var entities$2 = stringifyEntities;

var doctype = serializeDoctype;

function serializeDoctype(ctx, node) {
  var sep = ctx.tightDoctype ? '' : ' ';
  var parts = ['<!' + (ctx.upperDoctype ? 'DOCTYPE' : 'doctype')];

  if (node.name) {
    parts.push(sep, node.name);

    if (node.public != null) {
      parts.push(' public', sep, quote(ctx, node.public));
    } else if (node.system != null) {
      parts.push(' system');
    }

    if (node.system != null) {
      parts.push(sep, quote(ctx, node.system));
    }
  }

  return parts.join('') + '>'
}

function quote(ctx, value) {
  var string = String(value);
  var quote =
    ccount$1(string, ctx.quote) > ccount$1(string, ctx.alternative)
      ? ctx.alternative
      : ctx.quote;

  return (
    quote +
    entities$2(string, xtend$2(ctx.entities, {subset: ['<', '&', quote]})) +
    quote
  )
}

var one$2 = one$1;

var all_1 = all$1;

// Serialize all children of `parent`.
function all$1(ctx, parent) {
  var results = [];
  var children = (parent && parent.children) || [];
  var index = -1;

  while (++index < children.length) {
    results[index] = one$2(ctx, children[index], index, parent);
  }

  return results.join('')
}

// Maps of subsets.
// Each value is a matrix of tuples.
// The first value causes parse errors, the second is valid.
// Of both values, the first value is unsafe, and the second is safe.
var constants$1 = {
  // See: <https://html.spec.whatwg.org/#attribute-name-state>.
  name: [
    ['\t\n\f\r &/=>'.split(''), '\t\n\f\r "&\'/=>`'.split('')],
    ['\0\t\n\f\r "&\'/<=>'.split(''), '\0\t\n\f\r "&\'/<=>`'.split('')]
  ],
  // See: <https://html.spec.whatwg.org/#attribute-value-(unquoted)-state>.
  unquoted: [
    ['\t\n\f\r &>'.split(''), '\0\t\n\f\r "&\'<=>`'.split('')],
    ['\0\t\n\f\r "&\'<=>`'.split(''), '\0\t\n\f\r "&\'<=>`'.split('')]
  ],
  // See: <https://html.spec.whatwg.org/#attribute-value-(single-quoted)-state>.
  single: [
    ["&'".split(''), '"&\'`'.split('')],
    ["\0&'".split(''), '\0"&\'`'.split('')]
  ],
  // See: <https://html.spec.whatwg.org/#attribute-value-(double-quoted)-state>.
  double: [
    ['"&'.split(''), '"&\'`'.split('')],
    ['\0"&'.split(''), '\0"&\'`'.split('')]
  ]
};

var xtend$1 = immutable;
var svg$1 = svg_1;
var find = find_1;
var spaces = spaceSeparatedTokens;
var commas = commaSeparatedTokens;
var entities$1 = stringifyEntities;
var ccount = ccount_1;
var all = all_1;
var constants = constants$1;

var element = serializeElement;

function serializeElement(ctx, node, index, parent) {
  var schema = ctx.schema;
  var omit = schema.space === 'svg' ? false : ctx.omit;
  var parts = [];
  var selfClosing =
    schema.space === 'svg'
      ? ctx.closeEmpty
      : ctx.voids.indexOf(node.tagName.toLowerCase()) > -1;
  var attrs;
  var content;
  var last;

  if (schema.space === 'html' && node.tagName === 'svg') {
    ctx.schema = svg$1;
  }

  attrs = serializeAttributes(ctx, node.properties);

  content = all(
    ctx,
    schema.space === 'html' && node.tagName === 'template' ? node.content : node
  );

  ctx.schema = schema;

  // If the node is categorised as void, but it has children, remove the
  // categorisation.
  // This enables for example `menuitem`s, which are void in W3C HTML but not
  // void in WHATWG HTML, to be stringified properly.
  if (content) selfClosing = false;

  if (attrs || !omit || !omit.opening(node, index, parent)) {
    parts.push('<', node.tagName, attrs ? ' ' + attrs : '');

    if (selfClosing && (schema.space === 'svg' || ctx.close)) {
      last = attrs.charAt(attrs.length - 1);
      if (
        !ctx.tightClose ||
        last === '/' ||
        (schema.space === 'svg' && last && last !== '"' && last !== "'")
      ) {
        parts.push(' ');
      }

      parts.push('/');
    }

    parts.push('>');
  }

  parts.push(content);

  if (!selfClosing && (!omit || !omit.closing(node, index, parent))) {
    parts.push('</' + node.tagName + '>');
  }

  return parts.join('')
}

function serializeAttributes(ctx, props) {
  var values = [];
  var index = -1;
  var key;
  var value;
  var last;

  for (key in props) {
    if (props[key] != null) {
      value = serializeAttribute(ctx, key, props[key]);
      if (value) values.push(value);
    }
  }

  while (++index < values.length) {
    last = ctx.tight ? values[index].charAt(values[index].length - 1) : null;

    // In tight mode, don’t add a space after quoted attributes.
    if (index !== values.length - 1 && last !== '"' && last !== "'") {
      values[index] += ' ';
    }
  }

  return values.join('')
}

function serializeAttribute(ctx, key, value) {
  var info = find(ctx.schema, key);
  var quote = ctx.quote;
  var result;
  var name;

  if (info.overloadedBoolean && (value === info.attribute || value === '')) {
    value = true;
  } else if (
    info.boolean ||
    (info.overloadedBoolean && typeof value !== 'string')
  ) {
    value = Boolean(value);
  }

  if (
    value == null ||
    value === false ||
    (typeof value === 'number' && value !== value)
  ) {
    return ''
  }

  name = entities$1(
    info.attribute,
    xtend$1(ctx.entities, {
      // Always encode without parse errors in non-HTML.
      subset:
        constants.name[ctx.schema.space === 'html' ? ctx.valid : 1][ctx.safe]
    })
  );

  // No value.
  // There is currently only one boolean property in SVG: `[download]` on
  // `<a>`.
  // This property does not seem to work in browsers (FF, Sa, Ch), so I can’t
  // test if dropping the value works.
  // But I assume that it should:
  //
  // ```html
  // <!doctype html>
  // <svg viewBox="0 0 100 100">
  //   <a href=https://example.com download>
  //     <circle cx=50 cy=40 r=35 />
  //   </a>
  // </svg>
  // ```
  //
  // See: <https://github.com/wooorm/property-information/blob/main/lib/svg.js>
  if (value === true) return name

  value =
    typeof value === 'object' && 'length' in value
      ? // `spaces` doesn’t accept a second argument, but it’s given here just to
        // keep the code cleaner.
        (info.commaSeparated ? commas.stringify : spaces.stringify)(value, {
          padLeft: !ctx.tightLists
        })
      : String(value);

  if (ctx.collapseEmpty && !value) return name

  // Check unquoted value.
  if (ctx.unquoted) {
    result = entities$1(
      value,
      xtend$1(ctx.entities, {
        subset: constants.unquoted[ctx.valid][ctx.safe],
        attribute: true
      })
    );
  }

  // If we don’t want unquoted, or if `value` contains character references when
  // unquoted…
  if (result !== value) {
    // If the alternative is less common than `quote`, switch.
    if (ctx.smart && ccount(value, quote) > ccount(value, ctx.alternative)) {
      quote = ctx.alternative;
    }

    result =
      quote +
      entities$1(
        value,
        xtend$1(ctx.entities, {
          // Always encode without parse errors in non-HTML.
          subset: (quote === "'" ? constants.single : constants.double)[
            ctx.schema.space === 'html' ? ctx.valid : 1
          ][ctx.safe],
          attribute: true
        })
      ) +
      quote;
  }

  // Don’t add a `=` for unquoted empties.
  return name + (result ? '=' + result : result)
}

var xtend = immutable;
var entities = stringifyEntities;

var text$1 = serializeText;

function serializeText(ctx, node, index, parent) {
  // Check if content of `node` should be escaped.
  return parent && (parent.tagName === 'script' || parent.tagName === 'style')
    ? node.value
    : entities(node.value, xtend(ctx.entities, {subset: ['<', '&']}))
}

var text = text$1;

var raw = serializeRaw;

function serializeRaw(ctx, node) {
  return ctx.dangerous ? node.value : text(ctx, node)
}

var one$1 = serialize;

var handlers = {
  comment: comment,
  doctype: doctype,
  element: element,
  raw: raw,
  root: all_1,
  text: text$1
};

var own = {}.hasOwnProperty;

function serialize(ctx, node, index, parent) {
  if (!node || !node.type) {
    throw new Error('Expected node, not `' + node + '`')
  }

  if (!own.call(handlers, node.type)) {
    throw new Error('Cannot compile unknown node `' + node.type + '`')
  }

  return handlers[node.type](ctx, node, index, parent)
}

var html = html_1$1;
var svg = svg_1;
var voids = require$$2;
var omission = omission$4;
var one = one$1;

var lib = toHtml;

var deprecationWarningIssued;

function toHtml(node, options) {
  var settings = options || {};
  var quote = settings.quote || '"';
  var alternative = quote === '"' ? "'" : '"';

  if (quote !== '"' && quote !== "'") {
    throw new Error('Invalid quote `' + quote + '`, expected `\'` or `"`')
  }

  if ('allowDangerousHTML' in settings && !deprecationWarningIssued) {
    deprecationWarningIssued = true;
    console.warn(
      'Deprecation warning: `allowDangerousHTML` is a nonstandard option, use `allowDangerousHtml` instead'
    );
  }

  return one(
    {
      valid: settings.allowParseErrors ? 0 : 1,
      safe: settings.allowDangerousCharacters ? 0 : 1,
      schema: settings.space === 'svg' ? svg : html,
      omit: settings.omitOptionalTags && omission,
      quote: quote,
      alternative: alternative,
      smart: settings.quoteSmart,
      unquoted: settings.preferUnquoted,
      tight: settings.tightAttributes,
      upperDoctype: settings.upperDoctype,
      tightDoctype: settings.tightDoctype,
      bogusComments: settings.bogusComments,
      tightLists: settings.tightCommaSeparatedLists,
      tightClose: settings.tightSelfClosing,
      collapseEmpty: settings.collapseEmptyAttributes,
      dangerous: settings.allowDangerousHtml || settings.allowDangerousHTML,
      voids: settings.voids || voids.concat(),
      entities: settings.entities || {},
      close: settings.closeSelfClosing,
      closeEmpty: settings.closeEmptyElements
    },
    node && typeof node === 'object' && 'length' in node
      ? {type: 'root', children: node}
      : node
  )
}

var hastUtilToHtml = lib;

exports.convert_1 = convert_1$1;
exports.getAugmentedNamespace = getAugmentedNamespace;
exports.hastUtilEmbedded = hastUtilEmbedded;
exports.hastUtilIsElement = hastUtilIsElement;
exports.hastUtilPhrasing = hastUtilPhrasing;
exports.hastUtilToHtml = hastUtilToHtml;
exports.hastUtilWhitespace = hastUtilWhitespace;
exports.hastscript = hastscript;
exports.mdastUtilToHast = mdastUtilToHast;
exports.unistBuilder = unistBuilder;
exports.unistUtilVisitParents = unistUtilVisitParents;
//# sourceMappingURL=hast-ea6dff5f.js.map
