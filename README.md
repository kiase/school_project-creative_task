# school_project-creative_task

### [[이곳을 클릭하여 웹사이트로 이동할 수 있습니다.]](https://kiase.github.io/school_project-creative_task/)
학교 '창의융합과제발표' 제출용 입니다.
## 주요 기능

화면에 음료를 놓고 클릭하면 화면에 보이는 음료가 어떤 음료인지 판단하여 읽어줍니다.
화면에 음료 하단을 놓고 드래그하면 음료의 유통기한을 읽어줍니다. (인식률이 떨어져 미완성)


# Web Page

## index.html
> 웹 페이지입니다.
> script 파일들을 불러옵니다.
> manifest.json 파일과 함께 모바일 환경에서 보기 편하게 합니다.

## manifest.json
> 모바일 환경에서 보기 편하게 설정하는 코드입니다.

## main.js
> 메인 자바 스크립트 파일입니다.
> 사이트의 주요 기능을 수행합니다.

# Deep learning

## model_gate
> gate 모델입니다.
> 화면에 음료가 보이는지, main 모델에서 이 음료를 식별할 수 있는지 여부를 판단합니다.

## model_main
> main 모델입니다.
> 화면에 보이는 음료가 어떠한 음료인지 판단합니다.
> 총 7가지 음료가 포함된 2000장의 사진으로 100회씩 학습되었습니다.

### File
#### metadata.json
> 모델의 메타데이터입니다.
#### model.json
> 딥러닝으로 학습된 모델입니다.
#### model.weights.bin
> 학습에 사용된 데이터입니다.
