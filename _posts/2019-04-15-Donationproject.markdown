---
layout: post
title:  "기부를 위한 플리마켓  시스템"
date:   2019-04-16
description: 누구나 쉽게 기부를 하기 위한 플리마켓 형식의 기부 시스템입니다.
---
세계기부지수를 보면 대한민국은 다소 기부지수가 낮은 편입니다. 그 이유 중 하나가 어떻게 기부를 하여야 하는지, 기부의 투명성이 의심스러워서 입니다. 그래서 요즘 온라인을 통한 기부가 많이 활성화 되고 있고 온라인 쇼핑 시장이 점점 커지고 있는 것을 이용하여 누구든지 자신이 판매 하고자 하는 물품을 올려 직접 기부대상과 기부하고자 하는 금액을 입력할 수 있습니다. 그리고 물품이 판매가 되었을 때 직접 설정한 기부대상에게 판매금액의 일부가 기부되는 방식의 시스템입니다.

<hr style="color:blue">

<h3>개발 내용</h3>
<p>개발기간: 2017.07 ~ 2017.10 (약 3개월)</p>
<p>개발인원: 4명</p>
<p>담당역할: 전반적인 UI설계및 레이아웃 컨트롤</p>
<p>플랫폼: Web</p>
<p>개발언어: HTML, CSS, Javascrip, Jquery</p>
<p>서버: Node.js</p>
<p>DBMS: MySQL</p>

<hr style="color:blue">

<h3>프로젝트 설계</h3>
<h4>시스템 개념도 & 시스템 구성도</h4>
그림1과 그림2는 시스템 개념도와 시스템 구성도를 나타낸다. 시스템 개념도는 클라이언트와 서버 데이터베이스로 구성되어있다. 클라이언트로는 판매자, 소비자, 기부대상으로 이루어져 있으며 판매자가 상품을 판매하고 소비자가 상품을 구매하면 판매 금액의 일부가 판매자에게 전달되고 기부대상에게 기부 된다.
<figure>
	<img src="{{ '/assets/img/concept.jpg'}}" alt="" style="width:500px; height:auto;">
	<figcaption>그림1. - 시스템 개념도</figcaption>
</figure>

<figure>
	<img src="{{ '/assets/img/dosystem.JPG'}}" alt="">
	<figcaption>그림2. - 시스템 구성도</figcaption>
</figure>

<h4>클래스다이어그램</h4>
그림3-1은 마켓등록 다이어그램을 나타낸다. 마켓을 등록하기 위해서는 회원만 등록할 수 있기 때문에 회원의 정보와 마켓에 필요한 정보, 물품 정보가 있어야한다. 물품목록UI에서는 등록된 물품의 정보들을 볼 수 있으며 마켓등록UI와 물품등록UI에서는 마켓의 정보와 물품의 정보가 있어야 등록이 가능하다.
<figure>
	<img src="{{ '/assets/img/ClassDiagram1.jpg' | prepend: site.baseurl }}" alt="" style="width:600px; height:420px;">
	<figcaption>그림3-1. - 마켓등록 다이어그램</figcaption>
</figure>
그림3-2는 마이페이지 다이어그램을 나타낸다. 마이페이지에서는 구매자로 로그인하면 회원이 구매한 물품에 대한 주문내역, 포인트 이력을 조회할 수 있으며, 판매자로 로그인하면 판매처에 대한 정보, 마켓에 대한 정보를 조회할 수 있다.
<figure>
	<img src="{{ '/assets/img/ClassDiagram2.jpg' | prepend: site.baseurl }}" alt="" style="width:600px; height:420px;">
	<figcaption>그림3-2. - 마이페이지 다이어그램</figcaption>
</figure>

<!-- Fig2-1, 2-2는 ClassDiagram을 나타낸다. Fig2-1에서 회원이 되기위해 회원정보를 입력하고 회원가입을 한다. 마켓을 등록하기 위해서는 마켓의 이름, 이미지, 시작일, 종료일, 기부대상, 기부금액이 필요하고 물품을 등록하기 위해서는 물품 이미지, 이름, 가격, 카테고리, 가격, 설명을 등록하여야한다. 물품을 식별하기 위해서 물품 번호, 카테고리 코드, 판매처 번호, 판매상태를 선택하여야한다.
Fig2-2는 마이페이지 클래스 다이어그램을 나타낸다. 마이페이지에서는 주문내역, 판매처관리, 포인트이력, 마켓관리를 보여준다. -->

<h4>데이터베이스설계</h4>

<figure>
	<img src="{{ '/assets/img/erd.png'}}" alt="" style="width:600px; height:420px;" >
	<figcaption>그림3. - E-R Diagram</figcaption>
</figure>
그림3은 ER다이어그램이다. 테이블로는 배송지, 회원_배송지, 회원, 마켓, 즐겨찾기, 기부단체, 기부대상, 주문, 포인트, 장바구니, 판매처, 피드백, 상품주문, 물품, 물품카테고리, 월별 우수회원통계로 구성되어있다. 회원이 정한 기부 대상으로 이미 진행되고 있는 마켓이 존재하면 등록이 제한된다. 마켓을 주최한 회원 역시 마켓의 판매처도 되어야 한다. 관리자의 판단에 따라 마켓의 상태는 대기, 진행, 실패가 될 수 있다. 마켓의 상태가 실패일 시 주최자는 수정을 통해 다시 마켓 등록을 신청할 수 있다. 기부금액은 판매자의 마켓 수익금 중 순수 이익을 제외한 기부 금액이 대상이다.

<hr style="color:blue">

<h3>개발 결과</h3>

그림1은 메인화면이다. 메인화면에는 기부대상에 대한 카테고리, 기부대상, 기부율을 확인할 수 있다. 구매자는 기부하고 싶은 대상을 클릭하면 해당 기부대상의 마켓 물품들을 확인하고 구매할 수 있다.그림2은 물품을 구매하는 화면이다. 물품의 사진, 가격, 수량, 카테고리, 기부금액, 물품에 대한 설명을 확인하고 구매하기를 클릭하면 구매페이지로 넘어가고 장바구니를 클릭하면 장바구니에 선택한 물품이 담기게 된다.

<figure>
<img src="{{ '/assets/img/main.png' | prepend: site.baseurl }}" alt="" style="width:600px; height:auto;">
<figcaption>그림1. - 메인화면</figcaption>
</figure>
<figure>
		<img src="{{ '/assets/img/goodsbuy.png' | prepend: site.baseurl }}" alt="" style="width:600px; height:420px;" >
		<figcaption>그림2. - 물품구매</figcaption>
</figure>

그림3는 마켓등록 화면이다. 주최자는 플리마켓을 열기위해 로그인인을 하고 기부대상 카테고리를 정한다. 그리고 마켓에 필요한 정보들을 입력한다. 등록이 완료되면 그림4에서 승인요청을 클릭하면 관리자의 승인을 기다리고 승인이 완료되면 마켓을 진행할 수 있다.

<figure>
<img src="{{ '/assets/img/marketresi.png' | prepend: site.baseurl }}" alt="" style="width:600px; height:auto;">
<figcaption>그림3. - 마켓등록</figcaption>
</figure>
<figure>
	<img src="{{ '/assets/img/marketreq.png'}}" alt="" style="width:600px; height:auto;">
	<figcaption>그림4. - 마켓승인요청</figcaption>
</figure>
그림5는 물품사진, 이름, 가격, 카테고리, 수량, 물품에 대한 설명을 작성하여 물품을 등록하는 화면이다.
그림5에서 등록한 물품들을 그림6 물품목록 화면에서 볼 수 있다. 화면에는 물품의 사진, 이름, 가격 그리고 판매처에 대한 정보, 기부반영 퍼센트를 볼 수 있다.
<figure>
	<img src="{{ '/assets/img/goodsresi.png'}}" alt="" style="width:600px; height:auto;">
	<figcaption>그림5. - 물품등록</figcaption>
</figure>
<figure>
	<img src="{{ '/assets/img/goodslist.png' | prepend: site.baseurl }}" alt="" style="width:600px; height:auto;">
	<figcaption>그림6. - 물품목록</figcaption>
</figure>

그림7은 마이페이지 화면이다. 주문내역조회, 판매처관리, 마켓관리, 포인트 이력을 확인할 수 있다.

<figure>
		<img src="{{ '/assets/img/mypage2.png'}}" alt="" style="width:600px; height:auto;">
		<figcaption>그림7. - 마이페이지</figcaption>
</figure>


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

<hr style="color:blue">

<h3>관련기술</h3>
<h4 style="text-align:center">MVC패턴</h4>

<figure>
	<img src="{{ '/assets/img/mvcp.JPG'}}" alt="">
	<figcaption>그림1. - MVC패턴</figcaption>
</figure>

그림1.은 모델-뷰-컨트롤러(Model–View–Controller, MVC)는 소프트웨어 공학에서 사용되는 소프트웨어 디자인 패턴이다. 이 패턴을 성공적으로 사용하면, 사용자 인터페이스로부터 비즈니스 로직을 분리하여 애플리케이션의 시각적 요소나 그 이면에서 실행되는 비즈니스 로직을 서로 영향 없이 쉽게 고칠 수 있는 애플리케이션을 만들 수 있다. MVC에서 모델은 애플리케이션의 정보(데이터)를 나타내며, 뷰는 텍스트, 체크박스 항목 등과 같은 사용자 인터페이스 요소를 나타내고, 컨트롤러는 데이터와 비즈니스 로직 사이의 상호동작을 관리한다. 굵은 선은 직접적인 관계를, 점선은 간접적인 관계를 나타낸다.


<!-- <figure>
	<img src="{{ '/assets/img/mvc.png' | prepend: site.baseurl }}" alt="" style="width: 300px; height: 300px;">
	<figcaption>MVC패턴</figcaption>
</figure> -->
