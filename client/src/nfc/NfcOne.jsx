import { useEffect, useState } from 'react'
import { Screen, Card, Btn } from './ui'
import NfcEnroll from './NfcEnroll'
import NfcSurvey from './NfcSurvey'
import NfcGraduate from './NfcGraduate'
import { useVisitor } from './useVisitor'

// QR 하나로 끝나는 흐름. 이름을 적고 입학하면 바로 질문으로 이어지고, 답을 보내면 졸업증서가 나온다.
// 같은 휴대폰으로 다시 열면 멈춘 단계부터 이어진다. NFC 1번 2번 3번 태그도 모두 이 화면을 연다.
export default function NfcOne() {
  const { status, visitor } = useVisitor()
  const [stage, setStage] = useState(null)

  useEffect(() => {
    if (stage) return
    if (status === 'none') setStage('enroll')
    else if (status === 'ready' && visitor) setStage(visitor.quiz_at ? 'grad' : 'survey')
  }, [status, visitor, stage])

  if (status === 'error' && !stage) {
    return (
      <Screen title="UIA 대학교" dock={<Btn onClick={() => window.location.reload()}>다시 시도</Btn>}>
        <Card logo><h1 className="vg-q" style={{ marginTop: 0 }}>연결이 끊겼어요</h1><p className="vg-body">인터넷 연결을 확인한 뒤 다시 시도해 주세요.</p></Card>
      </Screen>
    )
  }
  if (!stage) return <Screen title="UIA 대학교"><Card logo><p className="vg-body" style={{ marginTop: 0 }}>불러오는 중이에요.</p></Card></Screen>

  const toEnroll = () => setStage('enroll')
  if (stage === 'enroll') return <NfcEnroll key="e" onNext={() => setStage('survey')} onReset={toEnroll} />
  if (stage === 'survey') return <NfcSurvey key="s" onDone={() => setStage('grad')} onReset={toEnroll} />
  return <NfcGraduate key="g" onReset={toEnroll} onSurvey={() => setStage('survey')} />
}
