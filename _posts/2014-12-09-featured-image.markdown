---
layout: post
title:  "소프트웨어 분석과 설계"
date:   2014-12-14
description: 하나의 아이디어(워터파크 서비스 이용 시스템)를 정하여 구현하지 않고 그에 대한 소프트웨어 분석과 설계에 대해 공부한 내용입니다.
---
하나의 주제를 정하여 소프트웨어 분석과 설계 공부를 한 내용이다. 워터파크 서비스 이용 시스템이며 내용으로는 다음과 같다.
여름에는 대부분 사람들이 더위를 피해 시원함을 느끼기 위해서 물놀이를 가기 때문에 성수기에는 워터파크 이용객도 그만큼 증가한다. 그래서 워터파크 시설을 이용하거나 물품을 대여할 시 사람들이 몰리고 대기 시간이 길어져서 많은 사람들이 불편함을 느낀다. 이를 해결하고자 워터파크에서는 아래의 그림과 같이 워터파크 이용객들에게 어플을 통해 서비스를 제공한다. 밑에 pdf에서 ㅍ로젝트 정의서와 요구사항 기술서에 대한 전체 문서 내용을 확인할 수 있다.
<ul>
	<li>워터파크 서비스 이용 시스템 <a href="/assets/img/D001프로젝트 정의서.pdf" ><strong>프로젝트 정의서 pdf</strong></a>
  </li>
  <li>워터파크 서비스 이용 시스템 <a href="/assets/img/D002요구사항기술서.pdf" ><strong>요구사항 기술서 pdf</strong></a>
  </li>
</ul>

<hr>

<h3>프로젝트 설계</h3>
<h4>클래스 분석</h4>
그림1은 코인팔찌 시퀀스 다이어그램이다. 사용자가 메인 UI에 있는 코인팔찌 등록 버튼을 누른다. 누르면 코인 팔찌 등록UI가 생성되어 바코드를 스캔 할 수 있는 화면을 보여준다. 바코드를 스캔하면 데이터베이스에서 현재 스캔한 바코드가 코인팔찌가 맞는지 확인한다. 코인팔찌 바코드 스캔이 완료되고 앱에 코인팔찌를 처음으로 등록할 경우, 예매번호 입력 팝업창을 띄워 예매번호를 입력하고 그 예매번호가 맞는 지 확인한 후 예매번호가 맞거나 두 번째 바코드를 입력할 경우, 닉네임 입력 팝업창을 띄워 닉네임을 입력한다. 입력한 닉네임이 중복인지 아닌지 확인한 후 중복이 아니라면 바코드를 등록시킨다.

<figure>
		<img src="{{ '/assets/img/코인팔찌등록.jpg'}}" alt="" style="width:600px; height:auto;">
		<figcaption>그림1. - 코인팔찌 등록</figcaption>
</figure>

그림2는 대여예약 시퀀스 다이어그램이다. 사용자가 메인UI에 있는 대여 예약 버튼을 누른다. 누르면 실시간 물품 현황UI에서 물품의 종류, 대여 가능 상태를 볼 수 있다. 대여 가능 버튼을 누르면 대여 예약 및 결제UI에서 물품에 따른 대여 가격, 물품 위치를 확인하고 결제 수단을 선택할 수 있다. 결제가 완료되면 물품의 대여 상태는 수정된다. 그리고 코인팔찌의 잔여 금액도 수정이 된다. 대여 예약이 완료되었다는 popup이 뜨고 확인 버튼을 누르면 대여내역확인UI로 넘어간다.

<figure>
		<img src="{{ '/assets/img/대여예약.jpg'}}" alt="" style="width:600px; height:auto;">
		<figcaption>그림2. - 대여예약</figcaption>
</figure>

<ul>
<li>워터파크 서비스 이용 시스템 <a href="/assets/img/D003클래스분석서.pdf" ><strong>클래스 분석서 pdf</strong></a>
</li>
</ul>

<h4>UI설계</h4>
그림3은 워터파크 관리 시스템, 그림4는 워터파크 앱의 화면 구성도를 보여준다.

<figure>
		<img src="{{ '/assets/img/워터파크관리시스템.png'}}" alt="" style="width:600px; height:auto;">
		<figcaption>그림3. - 워터파크 관리 시스템</figcaption>
</figure>

<figure>
		<img src="{{ '/assets/img/워터파크앱.png'}}" alt="" style="width:600px; height:auto;">
		<figcaption>그림4. - 워터파크 앱</figcaption>
</figure>
다음 그림5의 화면들은 메인화면, 코인팔찌 등록 화면, 예매번호 입력 화면, 코인 팔찌 등록 완료 화면, 코인 팔찌 등록 추가 화면 UI를 보여준다. 전체적인 UI설계는 밑에 pdf 문서에서 확인할 수 있다.
<figure>
		<img src="{{ '/assets/img/화면ui.png'}}" alt="" style="width:600px; height:auto;">
		<figcaption>그림5. - 워터파크 서비스 이용 시스템 화면 UI</figcaption>
</figure>
<ul>
  <li>워터파크 서비스 이용 시스템 <a href="/assets/img/D004UI설계서.pdf" ><strong>UI설계서 pdf</strong></a>
  </li>
</ul>
<h4>데이터베이스 설계</h4>
그림 6은 회원, 물품, 대여, 코인팔찌, 포스기-코인팔찌, 포스기, 직원 테이블로 구성되어있다.
<figure>
		<img src="{{ '/assets/img/디비설계.png'}}" alt="" style="width:600px; height:auto;">
		<figcaption>그림6. - E-R 다이어그램</figcaption>
</figure>
<ul>
  <li>워터파크 서비스 이용 시스템 <a href="/assets/img/D005데이터베이스설계서.pdf" ><strong>데이터베이스설계서 pdf</strong></a>
  </li>
</ul>
