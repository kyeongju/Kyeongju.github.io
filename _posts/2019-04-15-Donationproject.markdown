---
layout: post
title:  "기부를 위한 플리마켓  시스템"
date:   2019-04-16
description: 누구나 쉽게 기부를 하기 위한 플리마켓 형식의 기부 시스템입니다.
---
세계기부지수를 보면 대한민국은 다소 기부지수가 낮은 편입니다. 그 이유 중 하나가 어떻게 기부를 하여야 하는지, 기부의 투명성이 의심스러워서 입니다. 그래서 요즘 온라인을 통한 기부가 많이 활성화 되고 있고 온라인 쇼핑 시장이 점점 커지고 있는 것을 이용하여 누구든지 자신이 판매 하고자 하는 물품을 올려 직접 기부대상과 기부하고자 하는 금액을 입력할 수 있습니다. 그리고 물품이 판매가 되었을 때 직접 설정한 기부대상에게 판매금액의 일부가 기부되는 방식의 시스템입니다.

<h3>개발 내용</h3>
<p>개발기간: 2017.07 ~ 2017.10 (약 3개월)</p>
<p>개발인원: 4명</p>
<p>담당역할: (나중에적기)를 이용한 전반적인 레이아웃 컨트롤</p>
<p>플랫폼: Web</p>
<p>개발언어: HTML, CSS, Javascrip, Jquery</p>
<p>서버: Node.js</p>
<p>DBMS: MySQL</p>

<h3>프로젝트 설계</h3>

<figure>
	<img src="{{ '/assets/img/concept.jpg' | prepend: site.baseurl }}" alt="">
	<figcaption>Fig1. - Conceptual Diagram</figcaption>
</figure>

<figure>
	<img src="{{ '/assets/img/UseCaseDiagram1.jpg' | prepend: site.baseurl }}" alt="">
	<figcaption>Fig2. - UseCaseDiagram1</figcaption>
</figure>

<figure>
	<img src="{{ '/assets/img/UseCaseDiagram2.jpg' | prepend: site.baseurl }}" alt="">
	<figcaption>Fig3. - UseCaseDiagram2</figcaption>
</figure>

<figure>
	<img src="{{ '/assets/img/erd.png'}}" alt="" >
	<figcaption>Fig4. - E-R Diagram</figcaption>
</figure>

<h3>개발 결과</h3>

<figure>
<img src="{{ '/assets/img/main.png' | prepend: site.baseurl }}" alt="">
<figcaption>그림1-메인화면</figcaption>
</figure>
<figure>
		<img src="{{ '/assets/img/goodsbuy.png' | prepend: site.baseurl }}" alt="">
		<figcaption>그림-1.1물품구매</figcaption>
</figure>
그림1은 메인화면이다. 메인화면에는 기부대상에 대한 카테고리, 기부대상, 기부율을 확인할 수 있다. 구매자는 기부하고 싶은 대상을 클릭하면 해당 기부대상의 마켓 물품들을 확인하고 구매할 수 있다.그림1.1은 물품을 구매하는 화면이다.

<figure>
<img src="{{ '/assets/img/marketresi.png' | prepend: site.baseurl }}" alt="">
<figcaption>그림2-마켓등록</figcaption>
</figure>
<figure>
	<img src="{{ '/assets/img/marketreq.png'}}" alt="">
	<figcaption>그림3-마켓승인요청</figcaption>
</figure>
그림2는 마켓등록 화면이다. 주최자는 플리마켓을 열기위해 로그인인을 하고 기부대상 카테고리를 정한다. 그리고 마켓에 필요한 정보들을 입력한다. 등록이 완료되면 그림3에서 승인요청을 클릭하면 관리자의 승인을 기다리고 승인이 완료되면 마켓을 진행할 수 있다.

<figure>
	<img src="{{ '/assets/img/goodsresi.png'}}" alt="">
	<figcaption>그림4-물품등록</figcaption>
</figure>
<figure>
	<img src="{{ '/assets/img/goodslist.png' | prepend: site.baseurl }}" alt="">
	<figcaption>그림5-물품목록</figcaption>
</figure>
그림4는 물품사진, 이름, 가격, 카테고리, 수량, 물품에 대한 설명을 작성하여 물품을 등록하는 화면이다.
그림4에서 등록한 물품들을 그림5 물품목록 화면에서 볼 수 있다.

<figure>
		<img src="{{ '/assets/img/mypage1.png'}}" alt="">
		<figcaption>그림6.1-마이페이지</figcaption>
</figure>
<figure>
		<img src="{{ '/assets/img/mypage2.png'}}" alt="">
		<figcaption>그림6.2-마이페이지</figcaption>
</figure>

그림6.1,6.2는 마이페이지 화면이다. 주문내역과 포인트 이력을 확인할 수 있다.


<!-- <table class="type11">
    <tbody>
    <tr>
        <td>

          <img src="{{ '/assets/img/main.png' | prepend: site.baseurl }}" alt="">
          <figcaption>메인화면</figcaption>

        </td>
        <td>

          <img src="{{ '/assets/img/marketresi.png' | prepend: site.baseurl }}" alt="">
          <figcaption>마켓등록</figcaption>

        </td>
        <td>

           <img src="{{ '/assets/img/marketmanage.png' | prepend: site.baseurl }}" alt="">
           <figcaption>마켓관리</figcaption>

        </td>
    </tr>

    <tr>
        <td>

          <img src="{{ '/assets/img/goodslist.png' | prepend: site.baseurl }}" alt="">
          <figcaption>물품목록</figcaption>

        </td>
        <td>

          <img src="{{ '/assets/img/goodsbuy.png' | prepend: site.baseurl }}" alt="">
          <figcaption>물품구매</figcaption>

        </td>
        <td>

           <img src="{{ '/assets/img/feedback.png' | prepend: site.baseurl }}" alt="">
           <figcaption>피드백관리</figcaption>

        </td>
    </tr>

    <tr>
        <td>

          <img src="{{ '/assets/img/mypage1.png' | prepend: site.baseurl }}" alt="">
          <figcaption>마이페이지</figcaption>

        </td>
        <td>

          <img src="{{ '/assets/img/mypage2.png' | prepend: site.baseurl }}" alt="">
          <figcaption>마이페이지</figcaption>

        </td>

    </tr>


    </tbody>
</table> -->

<!-- <style>
		table.type11 {
			border-collapse: separate;
			border-spacing: 1px;
			text-align: center;
			line-height: 1.5;
			margin: 20px 10px;
		}
		table.type11 th {
			width: 155px;
			padding: 10px;
			font-weight: bold;
			vertical-align: top;
			color: #fff;
			/* background: #ce4869 ; */
		}
		table.type11 td {
			width: 155px;
			padding: 10px;
			vertical-align: top;
			border-bottom: 1px solid #ccc;
			/* background: #eee; */
		}
</style> -->

<h3>관련기술 글</h3>
<h4 style="text-align:center">MVC 패턴</h4>

<figure>
	<img src="{{ '/assets/img/mvc.png' | prepend: site.baseurl }}" alt="" style="width: 300px; height: 300px;">
	<figcaption>MVC패턴</figcaption>
</figure>

-------설명적기------

1. List Item
2. Longer List Item
    1. Nested OL Item
    2. Another Nested Item
3. List Item



Donec id elit non mi porta gravida at eget metus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Maecenas faucibus mollis interdum. Donec sed odio dui. Cras justo odio, dapibus ac facilisis in, egestas eget quam.
