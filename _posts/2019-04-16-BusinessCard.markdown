---
layout: post
title:  "명함관리 및 공유시스템"
date:   2019-04-14
description: 명함을 쉽게 공유하고 관리하는 시스템입니다.
---

대부분의 사람들은 명함을 소지하고 있습니다. 많은 명함을 받다 보면 명함에 대한 관리는 소홀해지기 마련이고 대중적으로 사용하고 있는 오프라인 명함은 직접 분류해야 하기 때문에 관리가 어렵습니다. 그래서 명함을 저장하면 명함을 이미지로 보여주고, 등록위치와 저장 시간을 저장해주어 명함 소지자에 대한 정보를 기억할 수 있도록 도와주고, NFC를 이용하여 상대방에게 쉽게 전달 할 수 있는 서비스입니다.
<hr>


<h3>개발 내용</h3>
<p>개발기간: 2018.08 ~ 2019.10 (약 2개월)</p>
<p>개발인원: 1명</p>
<p>담당역할: 전체적인 시스템 설계 및 개발</p>
<p>플랫폼: Web, APP</p>
<p>개발언어: HTML, CSS, Javascrip, Jquery, android</p>
<p>서버: PHP</p>
<p>DBMS: MySQL</p>

<hr style="color:blue">

<h3>프로젝트 설계</h3>

<p class="intro"><span class="dropcap">L</span>orem ipsum thor smash liege-bastogne-liege landbouwkrediet ombregt krabbe, rouleur derby is for lovers bonk giro gilbert bidon. Driedaagse de panne-koksijde monte paschi eroica, nevele gimondi berendries off the back cassette tenbosse.</p>

Bahamontes lanterne rouge normandie belgium. Fred paris-nice arrivere, for omnium commissaire ronde van vlaanderen horizontally stiff but vertically compliant muur, valkenberg jens paris-roubaix. Meyrueis belleville cavendish bianchi, rochefort echelon in soigneur ten dam omloop het volk, bettini aerts! Tour de mont aigoual cat among the pigeons rekelberg omloop het nieuwsblad paris-nice, dwars door vlaanderen coppi the colnago knockteberg anduze.
<hr>

<h3>개발 결과</h3>
<figure>
	<img src="{{ '/assets/img/cardresi.png'}}" alt="" style="width:600px; height:auto;">
	<figcaption>그림1. - 명함 등록 화면</figcaption>
</figure>
명함등록화면에서 회사이름, 이름, 이메일, 전화번호, 주소를 입력하고 등록하면 url을 데이터베이스에 자동으로 이미지로 저장시켜준다. Fig. 3에서 ‘list’를 클릭하면 명함 목록화면으로 전환되고 ‘image’를 클릭하면 저장된 이미지를 모두 보여준다. 검색창에 검색하여 찾는 정보를 보여준다.

<figure>
	<img src="{{ '/assets/img/cardimg.png'}}" alt="" style="width:600px; height:auto;">
	<figcaption>그림2. - 명함 이미지 화면</figcaption>
</figure>
그림2.는 그림1.에서 등록할 때 hml2 canvas를 사용하여 지정한 영역을 캡처하고 캡처한 이미지의 src를 텍스트로 데이터베이스에 저장시켜 불러온 화면이다.
<figure>
	<img src="{{ '/assets/img/cardlist.png'}}" alt="" style="width:600px; height:auto;">
	<figcaption>그림3. - 명함 목록 화면</figcaption>
</figure>
그림3. 명함목록 화면에서는 등록했던 정보 리스트를 보여준다. ‘화사명순’, ‘이름순’, ‘등록일순’을 클릭하면 정렬하여 보여준다. ‘수정하기’ 버튼을 클릭하면 상세보기화면으로 전환되고, ‘보기’ 버튼을 클릭하면 저장된 명함의 이미지를 보여준다. “삭제하기”버튼을 클릭하면 해당 명함이 삭제된다.
<figure>
	<img src="{{ '/assets/img/nfc.png'}}" alt="">
	<figcaption>그림4. - NFC 공유 화면</figcaption>
</figure>
그림4.는 NFC태그를 통해서 명함을 전송한 화면이다. NFC태그를 휴대폰에 대면 태그에 해당되는 명함과 아이디를 화면에 보여준다. “끝내기”버튼을 클릭하면 화면이 종료된다.
<hr>

<h3>관련기술</h3>
<h4 style="text-align:center">NFC 태그 발송</h4>
