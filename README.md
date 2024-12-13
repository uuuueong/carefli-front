# CareFLi
<div align="center">
선물을 고르고 축하 문구를 고민하는 데 들이는 시간을 줄이고 싶으신가요?

**케어플리**는 **LLM을 활용한 MBTI별 맞춤형 선물 추천 서비스**로,  
정성과 마음이 담긴 선물과 문구를 손쉽게 준비할 수 있도록 도와드립니다! 🎁
</div>

<div align="center">

<img width="50" alt="케어플리_1차로고_최종 1@2x" src="https://github.com/user-attachments/assets/d991ace5-3abd-4c3e-b098-0b9101eb617f" /><br><br>**케어플리**와 함께라면, 선물을 고르는 고민은 줄어들고,<br>더 많은 시간을 상대방을 위해 쓸 수 있습니다.<br>
지금 바로 케어플리를 이용해보세요!
</div>
<p align="center">
  <a href="#git-clone">Git clone</a> •
  <a href="#install-dependencies">Install Dependencies</a> •
  <a href="#run-the-project">Run the Project</a>
</p>

## <a id="git-clone">Git Clone</a>
### 1. repoistory를 clone하고 싶은 위치로 이동!
*ex) devel folder에 clone하고 싶은 경우*
```bash
cd devel  # devel folder로 이동
```

### 2. Git Clone

```bash
# carefli-front repository https
git clone https://github.com/uuuueong/carefli-front.git 
```
- 실행 결과
<img width="645" alt="스크린샷 2024-12-13 오전 10 02 48" src="https://github.com/user-attachments/assets/d56e0e6a-7a1b-4646-84f5-e460e7f15bc5" />
### 3. Repository로 이동
```bash
cd carefli-front # repository명
```
- 실행 결과<br>
<img width="375" alt="스크린샷 2024-12-13 오전 10 03 25" src="https://github.com/user-attachments/assets/ecf10b2f-8035-4afe-902a-d401b4c8abcc" />

## <a id="install-dependencies">Install Dependencies</a>
프로젝트를 로컬 환경에
### 1. npm 설치 확인!
`npm` 이 설치되어있지 않다면, 다음의 과정을 통해 설치 가능하다.

#### For macOS/Linux
```bash
# Node.js와 npm 설치
# homebrew를 이용 (macOS)
brew install node

# apt (Linux)
sudo apt update
sudo apt install nodejs npm
```

#### For Windows
1.Node.js installer [Node.js official website](https://nodejs.org/) 다운로드<br>
2.설명 따라 설치 진행, (npm 설치 옵션 확인 필수)<br>
3.설치 후, 다음의 코드를 통해 설치 확인
```bash
node -v  # node.js 버전 확인
npm -v   # npm 버전 확인
```

### 2. Install npm dependencies
프로젝트 실행을 위해 필요한 패키지를 한 번에 설치한다. 
#### For macOS/Linux/Windows
```bash
# repository로 이동하기! (이미 해당 경로에 있다면 스킵!)
cd carefli-front

# Install dependencies (실행에 필요한 패키지 설치!)
npm install
```

## <a id="run-the-project">Run the Project</a>
이제 Local에서 프로젝트를 실행할 준비가 거의 다 되어간다!<br>
마지막으로 .env 파일을 설정해주어야 한다.

#### 1. .env 파일 만들기
.env 파일을 careflifront 폴더 내에 생성하고,
```bash
REACT_APP_API_KEY= # 백엔드 연결 api key
REACT_APP_REST_API_KEY = # GPT 연결 api key

```

🚨 API 키 관리 주의: OpenAI 및 Backend의 API 키는 외부에 노출되면 안 된다. 따로 .env 파일에 키를 저장하고, .gitignore에 추가하여 GitHub에 업로드되지 않도록 설정했다.
<br>(*별도로 실행시키고자 하는 분은 [이메일](egenechung@gmailcom)로 연락하시면 GPT 및 백엔드 연결에 필요한 키를 전달해드리겠습니다!!*)

#### 2. 로컬 환경에서 서버 시작!
```bash
npm start
```
프로젝트가 시작되면 브라우저에서 `http://localhost:3000`을 통해 접속가능! (이미 사용 중인 포트일 경우, 대체 포트를 terminal/cmd에서 제공!)

---
이제 프로젝트를 실행 가능합니다!! 🚀 <br> 추가 문의 사항 : [이메일](egenechung@gmail.com)
