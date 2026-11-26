import { asset } from '../../utils/asset'
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="sf-top">
          <div>
            <img src={asset('/brand/uia-logo-official.svg')} alt="UIA" className="sf-logo" />
            <p className="sf-caps">University Impact Alliance</p>
          </div>
          <dl className="sf-info">
            <dt>명칭</dt><dd>대학 임팩트 얼라이언스 (UIA)</dd>
            <dt>준비위원장</dt><dd>신현상 (한양대학교 글로벌사회혁신단장)</dd>
            <dt>백본 조직</dt><dd>루트임팩트</dd>
            <dt>일반문의</dt><dd><a href="mailto:contact@uia.or.kr">contact@uia.or.kr</a></dd>
            <dt>웹사이트 제작</dt><dd>주현호 (<a href="mailto:h20222583@glab.hallym.ac.kr">h20222583@glab.hallym.ac.kr</a>)</dd>
          </dl>
        </div>
        <p className="sf-copy">Copyright © University Impact Alliance. All rights reserved.</p>
      </div>
    </footer>
  )
}
