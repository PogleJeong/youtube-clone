Recoder API
======

# 1. 필요한 Library

[Document] (https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject)

npm i regenerator-runtime
> regenerator로 컴파일된 생성기 및 비동기 함수를 위한 독립 실행형 런타임입니다.
> import regenerator from "regenerator-runtime"

# 2. 사용
    
    1. MediaDevices.getUserMedia()

    > 사용자에게 미디어 입력 장치 사용 권한을 요청하며, 사용자가 수락하면 요청한 미디어 종류의 트랙을 포함한 MediaStream (en-US)을 반환

    >> const mediaStream = navigator.mediaDevices.getUserMedia(constraints)

    >> constraints : 두 개의 구성 요소, video와 audio를 가지는 객체로, 요청할 미디어 유형에 대해 설명. ex: { audio: true, video: true }


    2. HTMLMediaElement srcObject

    >  HTMLMediaElement와 연결된 미디어의 소스 역할을 하는 객체를 설정하거나 반환

    >> const video = document.createElement('video');
    >> video.srcObject = mediaStream;


    3. MediaRecorder()

    > 기록할 MediaStream이 지정된 새 MediaRecorder 개체를 만듭니다.

    >. MediaRecorder.start()
    미디어 녹화를 시작합니다. 이 메서드는 선택적으로 밀리초 단위의 값을 가진 타임슬라이스 인수를 전달할 수 있습니다.

    > MediaRecorder.stop()
    저장된 데이터의 최종 Blob을 포함하는 dataavailable 이벤트가 발생하는 시점에서 기록을 중지합니다.

    > MediaRecorder.ondataavailable = (event) => {}
    MediaRecorder.stop()이 실행될 때 발생하는 이벤트.
    >> event.data 가 영상데이터(Blob)
    >> URL.createObjectURL(event.data); 를 통해 미디어데이터를 다운받을 수 있는 URL 로 만들어줌.