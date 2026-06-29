/* hskim-arch v0.5.1 — 배포본. created by hosung.kim@dplanex.com · 정본: base_workspace/design-system/arch.js (릴리스 시 동기화) */
/* ============================================================================
 * dpx-arch — 아키텍처 다이어그램 렌더러 (의존성 없음, tokens.css 기반)
 * topo.js의 후속. 명시적 그리드(layer×col) 배치 + 직각(orthogonal) 라우팅 +
 * 그룹 경계 박스 + 플로우(시나리오) 하이라이트/애니메이션 + 설명 패널 + 줌.
 *
 * 사용:
 *   <div class="arch"><script type="application/json">{ ... }</script></div>
 *
 * 스키마:
 *   node : { id, label, sub?, type?, icon?, layer, col?, span?, group?, desc?, badge? }
 *          type = person|system|service|data|ai|external|aws|security (색 카테고리)
 *          icon = ICONS 키 (생략 시 type 기본 아이콘)
 *          col  = 그리드 컬럼(소수 허용, 생략 시 해당 layer에서 중앙 정렬)
 *   group: { id, label, type? (plane|cloud|external|secure|data), desc? }
 *   edge : { from, to, label?, kind? (sync|async|data), desc? }  // dashed:true = async
 *   flow : { id, label, desc?, steps: [ "a->b" | {from,to,note?} | {node,note?} ] }
 *
 * 옵션(data-속성): data-legend="off" 범례 숨김, data-fit="off" 자동 맞춤 끔.
 * ==========================================================================*/
(function () {
  "use strict";

  var NODE_W = 176, HGAP = 56, VGAP = 92, PAD = 28, NODE_H = 44, NODE_H_SUB = 58;
  var GROUP_PAD = 16, GROUP_HEAD = 30, CORNER = 10;
  /* data-compact: 대형(전수) 다이어그램용 축소 치수 */
  function setDims(compact) {
    if (compact) { NODE_W = 132; HGAP = 30; VGAP = 62; PAD = 20; NODE_H = 34; NODE_H_SUB = 46; GROUP_PAD = 12; GROUP_HEAD = 26; }
    else { NODE_W = 176; HGAP = 56; VGAP = 92; PAD = 28; NODE_H = 44; NODE_H_SUB = 58; GROUP_PAD = 16; GROUP_HEAD = 30; }
  }

  /* ── 인라인 SVG 아이콘 (24×24 stroke, lucide 스타일) ── */
  var ICONS = {
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6.5 8-6.5S20 17 20 21"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.4 2.9-5.5 6.5-5.5s6.5 2.1 6.5 5.5"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18.2 15c2 .8 3.3 2.4 3.3 5"/>',
    monitor: '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
    mobile: '<rect x="8" y="2.5" width="8" height="19" rx="2"/><path d="M11.2 18.5h1.6"/>',
    box: '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>',
    layers: '<path d="m12 2.5 9.5 5.5L12 13.5 2.5 8Z"/><path d="m2.5 12.5 9.5 5.5 9.5-5.5M2.5 17l9.5 5.5L21.5 17"/>',
    gateway: '<rect x="9" y="2.5" width="6" height="6" rx="1.2"/><rect x="2.5" y="15.5" width="6" height="6" rx="1.2"/><rect x="15.5" y="15.5" width="6" height="6" rx="1.2"/><path d="M12 8.5V12M5.5 15.5V12h13v3.5"/>',
    plug: '<path d="M9 7V2.5M15 7V2.5M8 7h8v3.5a4 4 0 0 1-8 0Z"/><path d="M12 14.5V17a4 4 0 0 1-4 4H6"/>',
    db: '<ellipse cx="12" cy="5.5" rx="8" ry="3"/><path d="M4 5.5v13c0 1.7 3.6 3 8 3s8-1.3 8-3v-13"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    zap: '<path d="M13 2.5 4.5 13.5H11l-1.5 8L18 10.5h-6.5Z"/>',
    queue: '<rect x="3" y="4" width="18" height="4.2" rx="1.2"/><rect x="3" y="10" width="18" height="4.2" rx="1.2"/><rect x="3" y="16" width="18" height="4.2" rx="1.2"/>',
    storage: '<path d="M22 12.5H2M5.4 5.5h13.2l3.4 7v4.5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4.5Z"/><path d="M6 16h.01M10 16h.01"/>',
    bucket: '<rect x="3" y="3" width="18" height="5" rx="1.2"/><path d="M4.5 8v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8"/><path d="M10 12.5h4"/>',
    sparkles: '<path d="M12 3.5 13.8 8.7 19 10.5l-5.2 1.8L12 17.5l-1.8-5.2L5 10.5l5.2-1.8Z"/><path d="m19 16.5.8 1.7 1.7.8-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8Z"/>',
    bot: '<rect x="4.5" y="8" width="15" height="11" rx="2.5"/><path d="M12 8V4.5M8.5 4.5h7"/><path d="M9 13.5h.01M15 13.5h.01"/><path d="M2 13.5h2.5M19.5 13.5H22"/>',
    key: '<circle cx="8" cy="15.5" r="4.5"/><path d="m11.5 12.5 9-9M17.5 6.5l2.5 2.5M14.5 9.5l2.5 2.5"/>',
    shield: '<path d="M12 22s8-3.2 8-10V5.2L12 2 4 5.2V12c0 6.8 8 10 8 10Z"/>',
    'shield-check': '<path d="M12 22s8-3.2 8-10V5.2L12 2 4 5.2V12c0 6.8 8 10 8 10Z"/><path d="m9 11.6 2.1 2.1L15.4 9.4"/>',
    scroll: '<path d="M19 17.5V5a2 2 0 0 0-2-2H4.5"/><path d="M8 21h11a2 2 0 0 0 2-2v-1.5H10V19a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2.5h4"/>',
    cloud: '<path d="M17.5 19a4.5 4.5 0 0 0 .4-9A7 7 0 0 0 4.3 12.5 4 4 0 0 0 6 19.5Z"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14.5 14.5 0 0 1 0 18 14.5 14.5 0 0 1 0-18"/>',
    wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    doc: '<path d="M14 2.5H6.5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8Z"/><path d="M14 2.5V8h5.5M9 13h6M9 17h6"/>',
    chart: '<path d="M3.5 3.5v17h17"/><path d="M8 16.5v-5M12.5 16.5v-9M17 16.5v-6.5"/>',
    flame: '<path d="M12 2.5c1.2 4 5.5 5.5 5.5 10.5a5.5 5.5 0 0 1-11 0c0-2.2.9-3.9 2.2-5.6.4 1.7 1.3 2.7 3.3 3.3-1.2-3.2-1.2-5.9 0-8.2Z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    package: '<path d="m7.5 4.3 9 5.1"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>',
    lock: '<rect x="4.5" y="11" width="15" height="10" rx="2"/><path d="M8 11V7.5a4 4 0 0 1 8 0V11"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20.5 20.5-4.5-4.5"/>',
    card: '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M2.5 10h19"/>',
    store: '<path d="m3.5 9 1.4-4.5h14.2L20.5 9"/><path d="M3.5 9a2.8 2.8 0 0 0 5.6 0 2.9 2.9 0 0 0 5.8 0 2.8 2.8 0 0 0 5.6 0"/><path d="M5.5 11.8V20h13v-8.2"/><path d="M9.5 20v-5h5v5"/>',
    branch: '<path d="M6 3.5v11"/><circle cx="6" cy="18" r="2.8"/><circle cx="18" cy="6" r="2.8"/><path d="M18 9a9 9 0 0 1-9 9"/>',
    workflow: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><path d="M10 6.5h5a2 2 0 0 1 2 2V14"/>',
    bell: '<path d="M18 9a6 6 0 0 0-12 0c0 6-2.5 7-2.5 7h17S18 15 18 9"/><path d="M10 20a2.2 2.2 0 0 0 4 0"/>'
  };

  /* type → 색 카테고리 기본 아이콘/한국어 라벨 */
  var TYPES = {
    person:   { icon: "user",     ko: "사용자·액터" },
    system:   { icon: "layers",   ko: "핵심 시스템" },
    service:  { icon: "box",      ko: "서비스" },
    network:  { icon: "gateway",  ko: "네트워크·게이트웨이" },
    data:     { icon: "db",       ko: "데이터 저장소" },
    ai:       { icon: "sparkles", ko: "AI·LLM" },
    external: { icon: "globe",    ko: "외부 시스템" },
    aws:      { icon: "cloud",    ko: "AWS 관리형" },
    security: { icon: "shield",   ko: "보안·인증" }
  };
  var EDGE_KO = { sync: "동기 호출", async: "비동기·위임", data: "데이터 흐름" };

  var seq = 0;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function svgEl(tag, attrs) {
    var el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  }
  function div(cls, html) {
    var el = document.createElement("div");
    el.className = cls;
    if (html != null) el.innerHTML = html;
    return el;
  }
  function icon(name, cls) {
    var body = ICONS[name] || ICONS.box;
    return '<svg class="' + (cls || "arch-ico-svg") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + "</svg>";
  }

  /* ───────────────────────── 레이아웃 ───────────────────────── */
  function layout(nodes, groups) {
    var byLayer = {};
    nodes.forEach(function (n) { (byLayer[n.layer] = byLayer[n.layer] || []).push(n); });
    var layerKeys = Object.keys(byLayer).map(Number).sort(function (a, b) { return a - b; });

    // 1차: 명시 col 수집 → 전체 컬럼 수 파악
    var maxCol = 0;
    nodes.forEach(function (n) {
      if (n.col != null) maxCol = Math.max(maxCol, n.col + (n.span || 1) - 1);
      else maxCol = Math.max(maxCol, (byLayer[n.layer].length - 1));
    });

    // 2차: col 미지정 레이어는 그리드 정수 중앙 정렬로 배정
    layerKeys.forEach(function (k) {
      var arr = byLayer[k];
      var noCol = arr.filter(function (n) { return n.col == null; });
      if (!noCol.length) { arr.sort(function (a, b) { return a.col - b.col; }); return; }
      var width = noCol.reduce(function (s, n) { return s + (n.span || 1); }, 0);
      var start = Math.max(0, Math.round((maxCol + 1 - width) / 2 * 2) / 2); // 0.5 단위 중앙
      noCol.forEach(function (n) { n.col = start; start += (n.span || 1); });
      arr.sort(function (a, b) { return a.col - b.col; });
    });

    // 그룹 레이어 범위 (위/아래 여백 계산용)
    var gmeta = {};
    (groups || []).forEach(function (g) { gmeta[g.id] = { min: Infinity, max: -Infinity }; });
    nodes.forEach(function (n) {
      if (n.group && gmeta[n.group]) {
        gmeta[n.group].min = Math.min(gmeta[n.group].min, n.layer);
        gmeta[n.group].max = Math.max(gmeta[n.group].max, n.layer);
      }
    });

    // 행 Y 배치
    var pos = {}, rows = {}, y = PAD;
    layerKeys.forEach(function (k) {
      var arr = byLayer[k];
      var topX = 0, botX = 0;
      for (var id in gmeta) {
        if (gmeta[id].min === k) topX = Math.max(topX, GROUP_HEAD + 6);
        if (gmeta[id].max === k) botX = Math.max(botX, GROUP_PAD + 4);
      }
      y += topX;
      var rowH = 0;
      arr.forEach(function (n) {
        var w = (n.span || 1) * NODE_W + ((n.span || 1) - 1) * HGAP;
        var h = n.sub ? NODE_H_SUB : NODE_H;
        pos[n.id] = { x: PAD + n.col * (NODE_W + HGAP), y: y, w: w, h: h, n: n };
        rowH = Math.max(rowH, h);
      });
      rows[k] = { top: y, bottom: y + rowH };
      y += rowH + botX + VGAP;
    });

    var totalW = PAD * 2 + (maxCol + 1) * NODE_W + maxCol * HGAP;
    var totalH = y - VGAP + PAD;

    // 그룹 박스
    var gboxes = {};
    (groups || []).forEach(function (g) {
      var xs = [], ys = [], xe = [], ye = [];
      nodes.forEach(function (n) {
        if (n.group !== g.id) return;
        var p = pos[n.id];
        xs.push(p.x); ys.push(p.y); xe.push(p.x + p.w); ye.push(p.y + p.h);
      });
      if (!xs.length) return;
      gboxes[g.id] = {
        x: Math.min.apply(0, xs) - GROUP_PAD, y: Math.min.apply(0, ys) - GROUP_HEAD,
        w: Math.max.apply(0, xe) - Math.min.apply(0, xs) + GROUP_PAD * 2,
        h: Math.max.apply(0, ye) - Math.min.apply(0, ys) + GROUP_HEAD + GROUP_PAD, g: g
      };
    });

    var gtop = {}, gbot = {};
    for (var gid2 in gmeta) { gtop[gid2] = gmeta[gid2].min; gbot[gid2] = gmeta[gid2].max; }
    return { pos: pos, rows: rows, layerKeys: layerKeys, totalW: totalW, totalH: totalH, gboxes: gboxes, gtop: gtop, gbot: gbot };
  }

  /* ───────────────────────── 엣지 라우팅 ───────────────────────── */
  function roundedPath(pts) {
    if (pts.length < 2) return "";
    var d = "M" + pts[0][0] + "," + pts[0][1];
    for (var i = 1; i < pts.length - 1; i++) {
      var p0 = pts[i - 1], p1 = pts[i], p2 = pts[i + 1];
      var l1 = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
      var l2 = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
      var r = Math.min(CORNER, l1 / 2, l2 / 2);
      if (r < 1) { d += " L" + p1[0] + "," + p1[1]; continue; }
      var a = [p1[0] - (p1[0] - p0[0]) / l1 * r, p1[1] - (p1[1] - p0[1]) / l1 * r];
      var b = [p1[0] + (p2[0] - p1[0]) / l2 * r, p1[1] + (p2[1] - p1[1]) / l2 * r];
      d += " L" + a[0] + "," + a[1] + " Q" + p1[0] + "," + p1[1] + " " + b[0] + "," + b[1];
    }
    var last = pts[pts.length - 1];
    return d + " L" + last[0] + "," + last[1];
  }

  function route(edges, L) {
    var pos = L.pos, rows = L.rows, keys = L.layerKeys;
    var lanes = {}; // 채널(레이어 사이 간격)별 사용 횟수
    function lane(gapKey) { lanes[gapKey] = (lanes[gapKey] || 0) + 1; return lanes[gapKey] - 1; }

    // 포트 분배: 노드별 면(side)별 엣지 목록
    var sides = {}; // nodeId|side -> [{e, otherX}]
    function claim(nid, side, e, otherX) {
      var k = nid + "|" + side;
      (sides[k] = sides[k] || []).push({ e: e, ox: otherX });
    }
    edges.forEach(function (e) {
      var a = pos[e.from], b = pos[e.to];
      if (!a || !b) return;
      var la = a.n.layer, lb = b.n.layer;
      if (lb > la) { claim(e.from, "b", e, b.x + b.w / 2); claim(e.to, "t", e, a.x + a.w / 2); e._dir = "down"; }
      else if (lb < la) { claim(e.from, "t", e, b.x + b.w / 2); claim(e.to, "b", e, a.x + a.w / 2); e._dir = "up"; }
      else {
        var adj = Math.abs((b.n.col || 0) - (a.n.col || 0)) <= 1.2;
        e._dir = adj ? "side" : "over";
        if (adj) {
          if (b.x >= a.x) { claim(e.from, "r", e, b.y); claim(e.to, "l", e, a.y); }
          else { claim(e.from, "l", e, b.y); claim(e.to, "r", e, a.y); }
        } else { claim(e.from, "t", e, b.x + b.w / 2); claim(e.to, "t", e, a.x + a.w / 2); }
      }
    });
    function port(nid, side, e) {
      var k = nid + "|" + side, arr = sides[k] || [], p = pos[nid];
      arr.sort(function (u, v) { return u.ox - v.ox; });
      var i = arr.findIndex(function (u) { return u.e === e; });
      var t = (i + 1) / (arr.length + 1);
      if (side === "b") return [p.x + p.w * t, p.y + p.h];
      if (side === "t") return [p.x + p.w * t, p.y];
      if (side === "l") return [p.x, p.y + p.h * t];
      return [p.x + p.w, p.y + p.h * t];
    }

    // 수직 통로 충돌 검사 (중간 레이어 노드 관통 여부)
    function blocked(x, fromLayer, toLayer) {
      var lo = Math.min(fromLayer, toLayer), hi = Math.max(fromLayer, toLayer);
      for (var id in pos) {
        var p = pos[id], l = p.n.layer;
        if (l <= lo || l >= hi) continue;
        if (x > p.x - 10 && x < p.x + p.w + 10) return true;
      }
      return false;
    }
    function clearX(sx, ex, la, lb) {
      if (!blocked(sx, la, lb)) return sx;
      var mid = (sx + ex) / 2, cands = [];
      var maxC = Math.round((L.totalW - PAD * 2 + HGAP) / (NODE_W + HGAP));
      for (var c = 0; c <= maxC; c++) cands.push(PAD + c * (NODE_W + HGAP) - HGAP / 2);
      cands.sort(function (a, b) { return Math.abs(a - mid) - Math.abs(b - mid); });
      for (var i = 0; i < cands.length; i++) if (!blocked(cands[i], la, lb)) return cands[i];
      return sx;
    }

    edges.forEach(function (e) {
      var a = pos[e.from], b = pos[e.to];
      if (!a || !b) return;
      var la = a.n.layer, lb = b.n.layer, pts, s, t;

      // 그룹 경계를 넘는 엣지는 채널을 그룹 헤더 바깥으로 (라벨 겹침 방지)
      function groupExtraTop(node) {
        return node.group && a.n.group !== b.n.group && L.gtop[node.group] === node.layer ? GROUP_HEAD + 6 : 0;
      }
      function groupExtraBot(node) {
        return node.group && a.n.group !== b.n.group && L.gbot[node.group] === node.layer ? GROUP_PAD + 6 : 0;
      }

      if (e._dir === "down") {
        s = port(e.from, "b", e); t = port(e.to, "t", e);
        var chY = t[1] - 20 - groupExtraTop(b.n) - lane("d" + lb) * 11;
        if (Math.abs(s[0] - t[0]) < 2 && !blocked(s[0], la, lb)) pts = [s, t];
        else {
          var vx = lb - la > 1 ? clearX(s[0], t[0], la, lb) : s[0];
          pts = vx === s[0]
            ? [s, [s[0], chY], [t[0], chY], t]
            : [s, [s[0], rows[la].bottom + 18], [vx, rows[la].bottom + 18], [vx, chY], [t[0], chY], t];
        }
      } else if (e._dir === "up") {
        s = port(e.from, "t", e); t = port(e.to, "b", e);
        var chY2 = t[1] + 20 + groupExtraBot(b.n) + lane("u" + lb) * 11;
        if (Math.abs(s[0] - t[0]) < 2 && !blocked(s[0], la, lb)) pts = [s, t];
        else {
          var vx2 = la - lb > 1 ? clearX(s[0], t[0], la, lb) : s[0];
          var upY = Math.max(8, rows[la].top - 18);
          pts = vx2 === s[0]
            ? [s, [s[0], chY2], [t[0], chY2], t]
            : [s, [s[0], upY], [vx2, upY], [vx2, chY2], [t[0], chY2], t];
        }
      } else if (e._dir === "side") {
        var right = pos[e.to].x >= pos[e.from].x;
        s = port(e.from, right ? "r" : "l", e); t = port(e.to, right ? "l" : "r", e);
        pts = Math.abs(s[1] - t[1]) < 2 ? [s, t] : [s, [(s[0] + t[0]) / 2, s[1]], [(s[0] + t[0]) / 2, t[1]], t];
      } else { // over: 같은 레이어, 사이에 노드 → 위로 우회 (스테이지 밖으로 나가지 않게 클램프)
        s = port(e.from, "t", e); t = port(e.to, "t", e);
        var hdr = 0;
        if (a.n.group && L.gtop[a.n.group] === la) hdr = GROUP_HEAD + 6;
        if (b.n.group && L.gtop[b.n.group] === lb) hdr = GROUP_HEAD + 6;
        var chY3 = Math.max(8, rows[la].top - 22 - hdr - lane("o" + la) * 11);
        pts = [s, [s[0], chY3], [t[0], chY3], t];
      }

      e._pts = pts;
      e._d = roundedPath(pts);
    });

    placeLabels(edges, L);
  }

  /* ── 라벨 충돌 회피 배치 ──
   * 노드·그룹 라벨 존·이미 배치된 라벨을 장애물로 보고,
   * 엣지 세그먼트들(가로 우선·긴 것 우선)의 여러 지점을 시도해 빈 자리에 배치. */
  function textW(s) {
    var w = 0;
    for (var i = 0; i < s.length; i++) w += s.charCodeAt(i) > 127 ? 10.5 : 6.2;
    return w + 20;
  }
  function boxHit(b, list) {
    for (var i = 0; i < list.length; i++) {
      var o = list[i];
      if (b[0] < o[2] && b[2] > o[0] && b[1] < o[3] && b[3] > o[1]) return true;
    }
    return false;
  }
  function placeLabels(edges, L) {
    var obstacles = [];
    for (var id in L.pos) {
      var p = L.pos[id];
      obstacles.push([p.x - 4, p.y - 4, p.x + p.w + 4, p.y + p.h + 4]);
    }
    for (var gid in L.gboxes) {
      var g = L.gboxes[gid];
      obstacles.push([g.x + 4, g.y + 2, g.x + 160, g.y + 26]); // 그룹 라벨 존
    }
    var placed = [];
    edges.forEach(function (e) {
      if (!e._pts || !e.label) return;
      var w = textW(e.label), h = 19;
      var segs = [];
      for (var i = 0; i < e._pts.length - 1; i++) {
        var a = e._pts[i], b = e._pts[i + 1];
        var len = Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
        if (len < 24) continue;
        segs.push({ a: a, b: b, len: len, h: Math.abs(a[1] - b[1]) < 1 });
      }
      segs.sort(function (u, v) { return (v.h - u.h) || (v.len - u.len); });
      if (!segs.length) segs.push({ a: e._pts[0], b: e._pts[e._pts.length - 1] });
      var fr = [0.5, 0.35, 0.65, 0.25, 0.75], best = null;
      for (var s = 0; s < segs.length && !best; s++) {
        for (var f = 0; f < fr.length && !best; f++) {
          var x = segs[s].a[0] + (segs[s].b[0] - segs[s].a[0]) * fr[f];
          var y = segs[s].a[1] + (segs[s].b[1] - segs[s].a[1]) * fr[f];
          var box = [x - w / 2, y - h / 2, x + w / 2, y + h / 2];
          if (!boxHit(box, obstacles) && !boxHit(box, placed)) best = [x, y, box];
        }
      }
      if (!best) { // 빈 자리가 없으면 세그먼트 중점에서 수직으로 비켜남 — 1차: 노드·라벨 모두 회피, 2차: 라벨만 회피
        var sg = segs[0];
        var x0 = (sg.a[0] + sg.b[0]) / 2, y0 = (sg.a[1] + sg.b[1]) / 2;
        var offs = [0, -18, 18, -36, 36, -54, 54];
        for (var k = 0; k < offs.length && !best; k++) {
          var box2 = [x0 - w / 2, y0 + offs[k] - h / 2, x0 + w / 2, y0 + offs[k] + h / 2];
          if (!boxHit(box2, placed) && !boxHit(box2, obstacles)) best = [x0, y0 + offs[k], box2];
        }
        for (var k2 = 0; k2 < offs.length && !best; k2++) {
          var box3 = [x0 - w / 2, y0 + offs[k2] - h / 2, x0 + w / 2, y0 + offs[k2] + h / 2];
          if (!boxHit(box3, placed)) best = [x0, y0 + offs[k2], box3];
        }
        if (!best) best = [x0, y0, [x0 - w / 2, y0 - h / 2, x0 + w / 2, y0 + h / 2]];
      }
      e._lab = [best[0], best[1]];
      placed.push(best[2]);
    });
  }

  /* ───────────────────────── 빌드 ───────────────────────── */
  function build(root) {
    var src = root.querySelector('script[type="application/json"]');
    if (!src) return;
    var data;
    try { data = JSON.parse(src.textContent); } catch (err) {
      root.appendChild(div("arch-error", "다이어그램 JSON 파싱 오류: " + esc(err.message)));
      return;
    }
    var id = ++seq;
    setDims(root.dataset.compact != null);
    var nodes = data.nodes || [], edges = data.edges || [], groups = data.groups || [], flows = data.flows || [];
    edges.forEach(function (e) { if (e.dashed && !e.kind) e.kind = "async"; });

    var L = layout(nodes, groups);
    route(edges, L);

    /* 컨테이너 골격 */
    root.innerHTML = "";
    root.classList.add("arch");
    var bar = div("arch-bar");
    var viewport = div("arch-viewport");
    var canvas = div("arch-canvas");
    var stage = div("arch-stage");
    stage.style.width = L.totalW + "px";
    stage.style.height = L.totalH + "px";
    canvas.appendChild(stage);
    viewport.appendChild(canvas);

    /* SVG 엣지 레이어 */
    var svg = svgEl("svg", { class: "arch-edges", width: L.totalW, height: L.totalH });
    var defs = svgEl("defs", {});
    defs.innerHTML =
      '<marker id="arch-ar-' + id + '" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7.5" markerHeight="7.5" orient="auto-start-reverse"><path d="M1,1.5 L8.5,5 L1,8.5" fill="none" stroke="hsl(var(--muted-foreground) / 0.75)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></marker>' +
      '<marker id="arch-ar-hi-' + id + '" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M1,1.5 L8.5,5 L1,8.5" fill="none" stroke="hsl(var(--arch-flow))" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></marker>';
    svg.appendChild(defs);
    stage.appendChild(svg);

    /* 그룹 박스 */
    var groupEls = {};
    for (var gid in L.gboxes) {
      var gb = L.gboxes[gid];
      var ge = div("arch-group g-" + (gb.g.type || "default"));
      ge.style.cssText = "left:" + gb.x + "px;top:" + gb.y + "px;width:" + gb.w + "px;height:" + gb.h + "px";
      ge.appendChild(div("arch-group-label", esc(gb.g.label)));
      ge.dataset.gid = gid;
      stage.appendChild(ge);
      groupEls[gid] = ge;
    }

    /* 엣지 DOM */
    var edgeEls = {}; // key -> {base, hi, anim, hit, label, e}
    function ekey(e) { return e.from + "->" + e.to; }
    edges.forEach(function (e) {
      if (!e._d) return;
      var k = ekey(e);
      var base = svgEl("path", { d: e._d, class: "arch-edge k-" + (e.kind || "sync"), "marker-end": "url(#arch-ar-" + id + ")" });
      var hi = svgEl("path", { d: e._d, class: "arch-edge-hi", "marker-end": "url(#arch-ar-hi-" + id + ")" });
      var anim = svgEl("path", { d: e._d, class: "arch-edge-anim" });
      var hit = svgEl("path", { d: e._d, class: "arch-edge-hit" });
      hit.dataset.ekey = k;
      svg.appendChild(base); svg.appendChild(hi); svg.appendChild(anim); svg.appendChild(hit);
      var lab = null;
      if (e.label) {
        lab = div("arch-elabel", esc(e.label));
        lab.style.cssText = "left:" + e._lab[0] + "px;top:" + e._lab[1] + "px";
        lab.dataset.ekey = k;
        stage.appendChild(lab);
      }
      edgeEls[k] = { base: base, hi: hi, anim: anim, hit: hit, label: lab, e: e };
    });

    /* 노드 DOM */
    var nodeEls = {};
    nodes.forEach(function (n) {
      var p = L.pos[n.id];
      var type = TYPES[n.type] ? n.type : "service";
      var el = div("arch-node t-" + type);
      el.style.cssText = "left:" + p.x + "px;top:" + p.y + "px;width:" + p.w + "px;height:" + p.h + "px";
      el.innerHTML =
        '<span class="arch-ico">' + icon(n.icon || TYPES[type].icon) + "</span>" +
        '<span class="arch-txt"><span class="arch-nlabel">' + esc(n.label) + "</span>" +
        (n.sub ? '<span class="arch-nsub">' + esc(n.sub) + "</span>" : "") + "</span>" +
        (n.badge ? '<span class="arch-nbadge">' + esc(n.badge) + "</span>" : "");
      el.dataset.nid = n.id;
      el.tabIndex = 0;
      el.setAttribute("role", "button");
      stage.appendChild(el);
      nodeEls[n.id] = el;
    });

    /* 스텝 배지 (플로우 활성 시 위치 계산) */
    var stepBadges = [];

    /* ── 상단 바: 플로우 버튼 + 줌 ── */
    var flowsBox = div("arch-flows");
    if (flows.length) {
      var allBtn = document.createElement("button");
      allBtn.className = "arch-flow-btn active";
      allBtn.textContent = "전체";
      allBtn.dataset.flow = "";
      flowsBox.appendChild(allBtn);
      flows.forEach(function (f) {
        var b = document.createElement("button");
        b.className = "arch-flow-btn";
        b.innerHTML = '<span class="dot"></span>' + esc(f.label);
        b.dataset.flow = f.id;
        flowsBox.appendChild(b);
      });
    }
    bar.appendChild(flowsBox);
    /* 스텝 칩 바: 플로우 활성 시 번호 버튼 노출 — 누르면 해당 스텝만 포커스 */
    var stepsBar = div("arch-steps");
    var zoom = div("arch-zoom");
    zoom.innerHTML =
      '<button data-z="out" title="축소">−</button>' +
      '<button data-z="fit" title="화면 맞춤">⊡</button>' +
      '<button data-z="in" title="확대">+</button>';
    bar.appendChild(zoom);
    root.appendChild(bar);
    root.appendChild(stepsBar);
    root.appendChild(viewport);

    /* 범례 */
    if (root.dataset.legend !== "off") {
      var used = {};
      nodes.forEach(function (n) { used[TYPES[n.type] ? n.type : "service"] = 1; });
      var lg = div("arch-legend");
      Object.keys(TYPES).forEach(function (t) {
        if (used[t]) lg.appendChild(div("arch-legend-item t-" + t, '<span class="sw"></span>' + TYPES[t].ko));
      });
      root.appendChild(lg);
    }

    /* 설명 패널 */
    var panel = div("arch-panel");
    viewport.appendChild(panel);
    function closePanel() {
      panel.classList.remove("open");
      stage.querySelectorAll(".sel").forEach(function (x) { x.classList.remove("sel"); });
      for (var k in edgeEls) { edgeEls[k].hi.classList.remove("sel"); }
    }
    function openPanel(html) {
      // 우측 레일이 있으면 모든 설명 패널(노드·엣지·그룹·플로우·스텝)을 레일로 — 떠다니는 팝업 대체
      if (window.dpxRail && window.dpxRail.open) { window.dpxRail.open(html); return; }
      panel.innerHTML = html + '<button class="arch-panel-x" aria-label="닫기">×</button>';
      panel.classList.add("open");
      if (panelPos) { panel.style.left = panelPos.x + "px"; panel.style.top = panelPos.y + "px"; panel.style.right = "auto"; }
    }

    /* 패널 드래그 — 강조 영역과 겹칠 때 사용자가 직접 옮긴다. 옮긴 위치는 이 다이어그램에서 유지 */
    var panelPos = null;
    panel.addEventListener("pointerdown", function (ev) {
      if (ev.target.closest("button,a,li,.lnk")) return; // 클릭 요소는 드래그 제외
      var r0 = panel.getBoundingClientRect(), v0 = viewport.getBoundingClientRect();
      var sx = ev.clientX, sy = ev.clientY, ox = r0.left - v0.left, oy = r0.top - v0.top, moved = false;
      function mv(e2) {
        var dx = e2.clientX - sx, dy = e2.clientY - sy;
        if (!moved && Math.abs(dx) + Math.abs(dy) < 4) return; // 클릭과 구분
        moved = true;
        var nx = Math.max(4, Math.min(viewport.clientWidth - panel.offsetWidth - 4, ox + dx));
        var ny = Math.max(4, Math.min(viewport.clientHeight - 40, oy + dy));
        panel.style.left = nx + "px"; panel.style.top = ny + "px"; panel.style.right = "auto";
        panelPos = { x: nx, y: ny };
        panel.classList.add("dragging");
      }
      function up() {
        document.removeEventListener("pointermove", mv);
        document.removeEventListener("pointerup", up);
        panel.classList.remove("dragging");
      }
      document.addEventListener("pointermove", mv);
      document.addEventListener("pointerup", up);
    });

    function nodePanel(n) {
      var type = TYPES[n.type] ? n.type : "service";
      var ins = edges.filter(function (e) { return e.to === n.id; });
      var outs = edges.filter(function (e) { return e.from === n.id; });
      var rel = "";
      outs.forEach(function (e) {
        var t = nodes.find(function (x) { return x.id === e.to; });
        rel += '<li data-ekey="' + esc(ekey(e)) + '"><span class="dir">→</span> ' + esc(t ? t.label : e.to) + (e.label ? ' <em>' + esc(e.label) + "</em>" : "") + "</li>";
      });
      ins.forEach(function (e) {
        var f = nodes.find(function (x) { return x.id === e.from; });
        rel += '<li data-ekey="' + esc(ekey(e)) + '"><span class="dir">←</span> ' + esc(f ? f.label : e.from) + (e.label ? ' <em>' + esc(e.label) + "</em>" : "") + "</li>";
      });
      openPanel(
        '<div class="arch-panel-head t-' + type + '"><span class="arch-ico">' + icon(n.icon || TYPES[type].icon) + "</span>" +
        '<div><div class="t">' + esc(n.label) + '</div><div class="k">' + TYPES[type].ko + "</div></div></div>" +
        (n.sub ? '<p class="s">' + esc(n.sub) + "</p>" : "") +
        (n.desc ? '<p class="d">' + esc(n.desc).replace(/\n/g, "<br>") + "</p>" : "") +
        (n.link ? '<a class="lnk" href="' + esc(n.link) + '">' + esc(n.linkLabel || "자세히 보기") + " →</a>" : "") +
        (rel ? '<div class="h">연결</div><ul class="rel">' + rel + "</ul>" : "")
      );
    }
    function edgePanel(e) {
      var f = nodes.find(function (x) { return x.id === e.from; });
      var t = nodes.find(function (x) { return x.id === e.to; });
      openPanel(
        '<div class="arch-panel-head"><div><div class="t">' + esc(f ? f.label : e.from) + " → " + esc(t ? t.label : e.to) + "</div>" +
        '<div class="k">' + (EDGE_KO[e.kind] || EDGE_KO.sync) + "</div></div></div>" +
        (e.label ? '<p class="s">' + esc(e.label) + "</p>" : "") +
        (e.desc ? '<p class="d">' + esc(e.desc).replace(/\n/g, "<br>") + "</p>" : "")
      );
    }
    function groupPanel(g) {
      openPanel(
        '<div class="arch-panel-head"><div><div class="t">' + esc(g.label) + '</div><div class="k">그룹 · 경계</div></div></div>' +
        (g.desc ? '<p class="d">' + esc(g.desc).replace(/\n/g, "<br>") + "</p>" : "")
      );
    }

    /* ── 플로우 상태 머신 ── */
    var flowTimers = [];
    function clearFlow() {
      flowTimers.forEach(clearTimeout); flowTimers = [];
      root.classList.remove("arch-flowing", "arch-focus");
      stage.querySelectorAll(".on,.dim,.off,.flowing,.pulse").forEach(function (x) {
        x.classList.remove("on", "dim", "off", "flowing", "pulse");
      });
      for (var k in edgeEls) edgeEls[k].anim.classList.remove("on", "flowing");
      stepBadges.forEach(function (b) { b.remove(); });
      stepBadges = [];
    }
    function resolveStep(st) {
      if (typeof st === "string") {
        if (st.indexOf("->") > -1) { var p = st.split("->"); return { from: p[0].trim(), to: p[1].trim() }; }
        return { node: st };
      }
      return st;
    }
    function activateFlow(f) {
      clearFlow();
      root.classList.add("arch-flowing");
      var focus = !!f.focus; // focus 모드: 비참여 요소를 숨겨 "필요한 테이블만" 표시
      if (focus) root.classList.add("arch-focus");
      var offCls = focus ? "off" : "dim";
      var members = { nodes: {}, edges: {}, groups: {} };
      var steps = (f.steps || []).map(resolveStep);
      steps.forEach(function (st) {
        if (st.node) members.nodes[st.node] = 1;
        else if (st.from && st.to) { members.edges[st.from + "->" + st.to] = 1; members.nodes[st.from] = 1; members.nodes[st.to] = 1; }
      });
      (f.nodes || []).forEach(function (nid) { members.nodes[nid] = 1; });
      nodes.forEach(function (n) {
        var el = nodeEls[n.id];
        el.classList.add(members.nodes[n.id] ? "on" : offCls);
        if (members.nodes[n.id] && n.group) members.groups[n.group] = 1;
      });
      for (var gid in groupEls) groupEls[gid].classList.add(members.groups[gid] ? "on" : offCls);
      var edgeOffCls = f.muteEdges ? "off" : offCls; // muteEdges: 비참여 엣지를 거의 숨겨 강조 경로 가독성 확보
      // 번호 스텝이 있는 플로우는 스텝 엣지만 강조 — 멤버 간 일반 FK는 보통 선(맥락)으로 남긴다
      var hasSteps = steps.some(function (st) { return st.from && st.to; });
      for (var k in edgeEls) {
        var ee = edgeEls[k];
        // nodes 목록 기반 플로우(또는 focus)에서는 멤버 노드 사이의 연결선을 자동 강조
        var autoConnect = focus || (f.nodes && f.nodes.length);
        var bothMember = autoConnect && members.nodes[ee.e.from] && members.nodes[ee.e.to];
        var isHi = members.edges[k] || (!hasSteps && bothMember);
        if (isHi) { ee.hi.classList.add("on"); if (ee.label) ee.label.classList.add("on"); }
        else if (bothMember) { /* 멤버 간 비스텝 엣지: 강조 없이 기본 선 유지 */ }
        else { ee.base.classList.add(edgeOffCls); if (ee.label) ee.label.classList.add(edgeOffCls); }
      }
      // 순차 재생: 스텝별 딜레이로 배지 + 마칭 대시
      var si = 0;
      steps.forEach(function (st, i) {
        var delay = i * 420;
        if (st.from && st.to) {
          var k2 = st.from + "->" + st.to, ee2 = edgeEls[k2];
          if (!ee2) return;
          si++;
          (function (ee3, n3, st3) {
            flowTimers.push(setTimeout(function () {
              ee3.anim.classList.add("on", "flowing");
              placeStepBadge(ee3, n3, st3.note);
            }, delay));
          })(ee2, si, st);
        } else if (st.node && nodeEls[st.node]) {
          (function (el3) {
            flowTimers.push(setTimeout(function () { el3.classList.add("pulse"); }, delay));
          })(nodeEls[st.node]);
        }
      });
      renderStepChips(f, steps, -1);
      // 패널에 플로우 설명 + 스텝 목록
      var stepHtml = "";
      var n4 = 0;
      steps.forEach(function (st) {
        if (st.from && st.to) {
          n4++;
          var f4 = nodes.find(function (x) { return x.id === st.from; });
          var t4 = nodes.find(function (x) { return x.id === st.to; });
          stepHtml += '<li><span class="num">' + n4 + "</span><span>" + esc(f4 ? f4.label : st.from) + " → " + esc(t4 ? t4.label : st.to) +
            (st.note ? '<em>' + esc(st.note) + "</em>" : "") + "</span></li>";
        }
      });
      if (root.dataset.panel !== "off") {
        openPanel(
          '<div class="arch-panel-head"><div><div class="t">' + esc(f.label) + '</div><div class="k">플로우</div></div></div>' +
          (f.desc ? '<p class="d">' + esc(f.desc).replace(/\n/g, "<br>") + "</p>" : "") +
          (stepHtml ? '<div class="h">순서</div><ol class="steps">' + stepHtml + "</ol>" : "")
        );
      }
    }

    /* 배지 위치: 노드·자기 라벨·기존 배지를 피하는 지점 탐색 (플로우/스텝 포커스 공용) */
    function placeStepBadge(ee3, n3, note) {
      var len = ee3.base.getTotalLength();
      var fracs = [0.5, 0.34, 0.66, 0.22, 0.78], pt = null;
      for (var fi = 0; fi < fracs.length && !pt; fi++) {
        var c = ee3.base.getPointAtLength(len * fracs[fi]), bad = false;
        for (var nid2 in L.pos) {
          var p2 = L.pos[nid2];
          if (c.x > p2.x - 14 && c.x < p2.x + p2.w + 14 && c.y > p2.y - 14 && c.y < p2.y + p2.h + 14) { bad = true; break; }
        }
        if (!bad && ee3.label) {
          var lx = parseFloat(ee3.label.style.left), ly = parseFloat(ee3.label.style.top);
          if (Math.abs(lx - c.x) < ee3.label.offsetWidth / 2 + 16 && Math.abs(ly - c.y) < 19) bad = true;
        }
        if (!bad) {
          for (var bi = 0; bi < stepBadges.length; bi++) {
            var bx = parseFloat(stepBadges[bi].style.left), by = parseFloat(stepBadges[bi].style.top);
            if (Math.abs(bx - c.x) < 22 && Math.abs(by - c.y) < 22) { bad = true; break; }
          }
        }
        if (!bad) pt = c;
      }
      if (!pt) { var m = ee3.base.getPointAtLength(len * 0.5); pt = { x: m.x, y: m.y - 18 }; }
      var badge = div("arch-step", String(n3));
      if (note) badge.title = note;
      badge.style.cssText = "left:" + pt.x + "px;top:" + pt.y + "px";
      stage.appendChild(badge);
      stepBadges.push(badge);
    }

    /* ── 스텝 칩 바: 플로우 안의 개별 프로세스(번호)만 골라 보기 ── */
    function renderStepChips(f, steps, activeIdx) {
      stepsBar.innerHTML = "";
      var numbered = steps.filter(function (st) { return st.from && st.to && edgeEls[st.from + "->" + st.to]; });
      if (!numbered.length) { stepsBar.classList.remove("show"); return; }
      stepsBar.appendChild(div("lbl", esc(f.label) + " 스텝"));
      var all = document.createElement("button");
      all.className = "arch-step-chip" + (activeIdx < 0 ? " active" : "");
      all.textContent = "전체";
      all.addEventListener("click", function () { activateFlow(f); });
      stepsBar.appendChild(all);
      numbered.forEach(function (st, i) {
        var chip = document.createElement("button");
        chip.className = "arch-step-chip" + (i === activeIdx ? " active" : "");
        chip.textContent = String(i + 1);
        if (st.note) chip.title = st.note;
        chip.addEventListener("click", function () { focusStep(f, steps, numbered, i); });
        stepsBar.appendChild(chip);
      });
      stepsBar.classList.add("show");
    }

    /* 스텝 포커스: 선택한 프로세스(번호) 하나만 강조 — 나머지 플로우 멤버는 흐림, 비멤버는 숨김 수준 */
    function focusStep(f, steps, numbered, idx) {
      clearFlow();
      root.classList.add("arch-flowing");
      if (f.focus) root.classList.add("arch-focus");
      var st = numbered[idx];
      var k = st.from + "->" + st.to, ee = edgeEls[k];
      if (!ee) { activateFlow(f); return; }
      // 플로우 전체 멤버 집합 (활성 스텝 외 멤버는 dim 유지 — 맥락 보존)
      var members = { nodes: {}, edges: {} };
      steps.forEach(function (s2) {
        if (s2.node) members.nodes[s2.node] = 1;
        else if (s2.from && s2.to) { members.edges[s2.from + "->" + s2.to] = 1; members.nodes[s2.from] = 1; members.nodes[s2.to] = 1; }
      });
      (f.nodes || []).forEach(function (nid) { members.nodes[nid] = 1; });
      nodes.forEach(function (n) {
        var el = nodeEls[n.id];
        if (n.id === st.from || n.id === st.to) el.classList.add("on");
        else el.classList.add(members.nodes[n.id] ? "dim" : "off");
      });
      var grpOn = {};
      [st.from, st.to].forEach(function (nid) {
        var n5 = nodes.find(function (x) { return x.id === nid; });
        if (n5 && n5.group) grpOn[n5.group] = 1;
      });
      for (var gid in groupEls) groupEls[gid].classList.add(grpOn[gid] ? "on" : "dim");
      for (var k2 in edgeEls) {
        var ee2 = edgeEls[k2];
        if (k2 === k) { ee2.hi.classList.add("on"); if (ee2.label) ee2.label.classList.add("on"); }
        else { ee2.base.classList.add(members.edges[k2] ? "dim" : "off"); if (ee2.label) ee2.label.classList.add(members.edges[k2] ? "dim" : "off"); }
      }
      ee.anim.classList.add("on", "flowing");
      placeStepBadge(ee, idx + 1, st.note);
      renderStepChips(f, steps, idx);
      if (root.dataset.panel !== "off") {
        var f5 = nodes.find(function (x) { return x.id === st.from; });
        var t5 = nodes.find(function (x) { return x.id === st.to; });
        openPanel(
          '<div class="arch-panel-head"><div><div class="t">' + esc(f.label) + ' — 스텝 ' + (idx + 1) + ' / ' + numbered.length + '</div><div class="k">프로세스 포커스</div></div></div>' +
          '<p class="s">' + esc(f5 ? f5.label : st.from) + " → " + esc(t5 ? t5.label : st.to) + "</p>" +
          (st.note ? '<p class="d">' + esc(st.note) + "</p>" : "") +
          (ee.e.desc ? '<p class="d">' + esc(ee.e.desc).replace(/\n/g, "<br>") + "</p>" : "")
        );
      }
    }

    /* ── 줌 ── */
    var scale = 1;
    function applyScale() {
      stage.style.transform = "scale(" + scale + ")";
      stage.style.transformOrigin = "0 0";
      canvas.style.width = Math.ceil(L.totalW * scale) + "px";
      canvas.style.height = Math.ceil(L.totalH * scale) + "px";
      // 줌/리핏으로 노드 좌표가 바뀌면 외부 오버레이(피드백 핀)가 재배치하도록 알림
      try { window.dispatchEvent(new CustomEvent("arch:reflow")); } catch (e) {}
    }
    function fit() {
      var vw = viewport.clientWidth - 22;
      scale = Math.min(1, vw / L.totalW);
      applyScale();
    }
    zoom.addEventListener("click", function (ev) {
      var b = ev.target.closest("button"); if (!b) return;
      if (b.dataset.z === "in") { scale = Math.min(1.6, scale + 0.12); root.dataset._z = "1"; }
      else if (b.dataset.z === "out") { scale = Math.max(0.3, scale - 0.12); root.dataset._z = "1"; }
      else { delete root.dataset._z; fit(); return; }
      applyScale();
    });

    /* ── 이벤트 ── */
    flowsBox.addEventListener("click", function (ev) {
      var b = ev.target.closest(".arch-flow-btn"); if (!b) return;
      flowsBox.querySelectorAll(".arch-flow-btn").forEach(function (x) { x.classList.toggle("active", x === b); });
      closePanel();
      if (!b.dataset.flow) { clearFlow(); stepsBar.classList.remove("show"); stepsBar.innerHTML = ""; return; }
      var f = flows.find(function (x) { return x.id === b.dataset.flow; });
      if (f) activateFlow(f);
    });

    stage.addEventListener("click", function (ev) {
      var nodeEl = ev.target.closest(".arch-node");
      var labEl = ev.target.closest(".arch-elabel");
      var grpEl = ev.target.closest(".arch-group");
      closePanel();
      if (nodeEl) {
        var n = nodes.find(function (x) { return x.id === nodeEl.dataset.nid; });
        nodeEl.classList.add("sel");
        if (n) nodePanel(n);
        ev.stopPropagation();
      } else if (labEl) {
        var ee = edgeEls[labEl.dataset.ekey];
        if (ee) { ee.hi.classList.add("sel"); edgePanel(ee.e); }
        ev.stopPropagation();
      } else if (grpEl) {
        var g = groups.find(function (x) { return x.id === grpEl.dataset.gid; });
        if (g) { grpEl.classList.add("sel"); groupPanel(g); }
      }
    });
    svg.addEventListener("click", function (ev) {
      if (!ev.target.classList || !ev.target.classList.contains("arch-edge-hit")) return;
      closePanel();
      var ee = edgeEls[ev.target.dataset.ekey];
      if (ee) { ee.hi.classList.add("sel"); edgePanel(ee.e); }
      ev.stopPropagation();
    });
    panel.addEventListener("click", function (ev) {
      if (ev.target.classList.contains("arch-panel-x")) { closePanel(); return; }
      var li = ev.target.closest("li[data-ekey]");
      if (li) {
        var ee = edgeEls[li.dataset.ekey];
        if (ee) {
          for (var k in edgeEls) edgeEls[k].hi.classList.remove("sel");
          ee.hi.classList.add("sel");
        }
      }
    });
    root.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") closePanel();
      if (ev.key === "Enter" && ev.target.classList && ev.target.classList.contains("arch-node")) ev.target.click();
    });

    // 호버: 플로우 비활성 시 인접 강조
    nodes.forEach(function (n) {
      var el = nodeEls[n.id];
      el.addEventListener("mouseenter", function () {
        if (root.classList.contains("arch-flowing")) return;
        for (var k in edgeEls) {
          var e = edgeEls[k].e;
          if (e.from === n.id || e.to === n.id) {
            edgeEls[k].hi.classList.add("near");
            var other = e.from === n.id ? e.to : e.from;
            if (nodeEls[other]) nodeEls[other].classList.add("near");
          }
        }
      });
      el.addEventListener("mouseleave", function () {
        stage.querySelectorAll(".near").forEach(function (x) { x.classList.remove("near"); });
        for (var k in edgeEls) edgeEls[k].hi.classList.remove("near");
      });
    });

    /* 초기 맞춤 + 반응형 */
    if (root.dataset.fit !== "off") {
      fit();
      if (window.ResizeObserver) new ResizeObserver(function () { if (!root.dataset._z) fit(); }).observe(viewport);
    } else applyScale();
  }

  function init(scope) {
    var built = 0;
    (scope || document).querySelectorAll(".arch").forEach(function (el) {
      if (!el.dataset.archDone) { el.dataset.archDone = "1"; build(el); built++; }
    });
    // 렌더 완료 알림 — 외부 오버레이(피드백 핀 등)가 위치를 재계산하도록
    if (built) { try { window.dispatchEvent(new CustomEvent("arch:rendered", { detail: { count: built } })); } catch (e) {} }
  }

  window.dpxArch = { init: init, render: build, icons: ICONS };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { init(); });
  else init();
})();
