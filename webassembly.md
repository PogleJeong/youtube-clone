# 1. FFmpeg

[FFmpeg] (https://www.ffmpeg.org/)

오디오 및 비디오를 기록, 변환 및 스트리밍하는 완벽한 크로스 플랫폼 솔루션. FFmpeg는 인간과 기계가 만든 거의 모든 것을 디코딩, 인코딩, 트랜스코딩, mux, demux, 스트리밍, 필터링 및 재생할 수 있는 최고의 멀티미디어 프레임워크.

# 2. FFmpeg WebAssembly

WebAssembly에서 제공하는 브라우저 및 노드용 FFmpeg
ffmpeg.wasm은 FFmpeg의 순수한 Webassembly/Javascript 포트. 비디오 및 오디오 녹음, 변환, 스트리밍 등을 브라우저 내부에서 할 수 있도록 도와줌.
FFmpeg WebAssembly를 사용하는 이유는 FFmpeg를 사용해서 브라우저로 하여금 비디오 파일을 변환하기 위함.

> npm 설치 : npm install @ffmpeg/ffmpeg @ffmpeg/core
> github : https://github.com/ffmpegwasm/ffmpeg.wasm
> npm 페이지 : https://www.npmjs.com/package/@ffmpeg/ffmpeg

# 3. 사용

import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

> 1단계 - ffmpeg 소프트웨어 로드
const ffmpeg = createFFmpeg({ log: true}); // log : 로그추적
await ffmpeg.load(); // 소프트웨어 로드

> 2단계 - ffmpeg 이라는 가상의 컴퓨터에 파일 생성
ffmpeg.FS("writeFile", "recording.webm", binary file);
await ffmpeg.run("명령어") 