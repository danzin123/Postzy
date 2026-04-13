// app/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [activeTag, setActiveTag] = useState('Moderno')
  const [activeNetwork, setActiveNetwork] = useState('📸 Instagram')

  const styleTags = ['Moderno', 'Minimalista', 'Bold', 'Colorido', 'Elegante']
  const networks = [
    { label: '📸 Instagram' },
    { label: '📘 Facebook' },
    { label: '🎵 TikTok' }
  ]

  // Hook equivalente ao seu script de IntersectionObserver para as animações de scroll
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible')
          }, i * 60)
        }
      })
    }, { threshold: 0.1 })

    reveals.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <nav>
        <div className="logo">post<span>zy</span></div>
        <ul>
          <li><a href="#funcionalidades">Funcionalidades</a></li>
          <li><a href="#como-funciona">Como funciona</a></li>
          <li><a href="#precos">Preços</a></li>
          <li>
            <Link href="/login" className="nav-cta">Começar grátis</Link>
          </li>
        </ul>
      </nav>

      <section className="hero">
        <div className="hero-orb orb1"></div>
        <div className="hero-orb orb2"></div>
        <div className="hero-orb orb3"></div>

        <div className="badge">✨ Gerado com Inteligência Artificial</div>

        <h1>
          Criativos incríveis para<br />
          <span className="highlight">redes sociais</span> em segundos
        </h1>

        <p>
          Descreva sua promoção, produto ou serviço — e a Postzy cria a imagem, a legenda e as melhores hashtags automaticamente.
        </p>

        <div className="hero-actions">
          <Link href="/login" className="btn-primary">🚀 Criar meu primeiro criativo</Link>
          <a href="#demo" className="btn-secondary">
            <span>▶</span> Ver como funciona
          </a>
        </div>

        <div className="hero-social-proof">
          <div className="avatars">
            <div>MR</div>
            <div>JS</div>
            <div>AL</div>
            <div>+</div>
          </div>
          <span className="proof-text">Mais de <strong>2.400 empresas</strong> já usam a Postzy</span>
        </div>
      </section>

      <div id="demo" className="demo-section">
        <div className="demo-card reveal">
          <div className="demo-topbar">
            <div className="dot dot-r"></div>
            <div className="dot dot-y"></div>
            <div className="dot dot-g"></div>
            <span className="demo-topbar-label">postzy.com/criar</span>
          </div>
          <div className="demo-body">
            <div className="demo-left">
              <div className="demo-label">Descreva seu criativo</div>
              <textarea 
                className="demo-textarea" 
                readOnly 
                value="Quero um criativo para atrair alunos para minha academia com promoção de R$ 99,90 por mês. Transmita energia e motivação!" 
              />

              <div className="demo-label" style={{ marginTop: '20px' }}>Estilo visual</div>
              <div className="demo-options">
                {styleTags.map(tag => (
                  <span 
                    key={tag}
                    onClick={() => setActiveTag(tag)}
                    className={`demo-tag ${activeTag === tag ? 'active' : ''}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="demo-label" style={{ marginTop: '20px' }}>Rede social</div>
              <div className="demo-networks">
                {networks.map(net => (
                  <button 
                    key={net.label}
                    onClick={() => setActiveNetwork(net.label)}
                    className={`network-btn ${activeNetwork === net.label ? 'active' : ''}`}
                  >
                    {net.label}
                  </button>
                ))}
              </div>

              <button className="demo-generate">
                ✨ Gerar criativo
              </button>
              <div className="demo-credits">
                <span className="credit-icon">⚡</span>
                1 crédito será utilizado
              </div>
            </div>

            <div className="demo-right">
              <div className="demo-label">Criativo gerado</div>
              <div className="generated-image">
                <div className="sim-creative">
                  <div className="ai-badge-overlay">🤖 IA</div>
                  <div className="sim-gym-icon">💪</div>
                  <div className="sim-promo">TRANSFORME SEU<br />CORPO AGORA</div>
                  <div className="sim-price">R$ 99,90<span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)' }}>/mês</span></div>
                  <div className="sim-sub">Matricule-se hoje e comece sua jornada</div>
                  <div className="sim-tag-badge">🔥 OFERTA LIMITADA</div>
                </div>
              </div>

              <div className="output-section">
                <div className="output-title">Legenda gerada</div>
                <div className="output-text">Sua transformação começa com um passo. 💪 Por apenas R$ 99,90/mês, você tem acesso a equipamentos de ponta, personal trainer e muito mais. Não espere o dia perfeito — ele é hoje! 🔥</div>
              </div>

              <div className="output-section">
                <div className="output-title">Hashtags sugeridas</div>
                <div className="hashtags">
                  {['#academia', '#fitness', '#treino', '#transformacao', '#musculacao', '#saude', '#promocao', '#gym', '#workout', '#bodybuilding'].map(tag => (
                    <span key={tag} className="hashtag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section id="funcionalidades" className="section">
        <p className="section-label">Funcionalidades</p>
        <h2 className="section-title reveal">Tudo que você precisa<br />para dominar as redes</h2>
        <p className="section-sub reveal">Crie conteúdo profissional sem precisar de designer ou copywriter. Em segundos.</p>

        <div className="features-grid">
          <div className="feature-card reveal">
            <div className="feature-icon">🎨</div>
            <div className="feature-title">Imagens geradas por IA</div>
            <div className="feature-text">Criativos únicos e personalizados para sua marca, gerados em segundos com base na sua descrição.</div>
          </div>
          <div className="feature-card reveal">
            <div className="feature-icon">✍️</div>
            <div className="feature-title">Legenda automática</div>
            <div className="feature-text">Copies persuasivas e engajadoras criadas pela IA, adaptadas para o tom da sua marca e objetivo do post.</div>
          </div>
          <div className="feature-card reveal">
            <div className="feature-icon">#</div>
            <div className="feature-title">Hashtags inteligentes</div>
            <div className="feature-text">As melhores hashtags para maximizar o alcance do seu post, selecionadas pela IA com base no seu nicho.</div>
          </div>
          <div className="feature-card reveal">
            <div className="feature-icon">📱</div>
            <div className="feature-title">Multi-plataforma</div>
            <div className="feature-text">Formatos otimizados para Instagram, Facebook, TikTok, LinkedIn e muito mais. Um clique, todas as redes.</div>
          </div>
          <div className="feature-card reveal">
            <div className="feature-icon">⚡</div>
            <div className="feature-title">Sistema de créditos</div>
            <div className="feature-text">Compre créditos avulsos ou assine um plano mensal. Use quando quiser, sem mensalidades obrigatórias.</div>
          </div>
          <div className="feature-card reveal">
            <div className="feature-icon">🏷️</div>
            <div className="feature-title">Identidade de marca</div>
            <div className="feature-text">Salve as cores, fontes e estilo da sua marca. Todos os criativos gerados já saem com a sua identidade visual.</div>
          </div>
        </div>
      </section>

      <div id="como-funciona" className="how-section">
        <div className="steps-container">
          <p className="section-label">Como funciona</p>
          <h2 className="section-title reveal" style={{ marginBottom: '16px' }}>De 0 ao criativo pronto<br />em menos de 30 segundos</h2>
          <p className="section-sub reveal">Sem curva de aprendizado. Sem photoshop. Sem complicação.</p>

          <div className="steps-grid">
            <div className="step reveal">
              <div className="step-num">01</div>
              <div className="step-title">Descreva seu objetivo</div>
              <div className="step-text">Escreva em linguagem natural o que você quer comunicar — promoção, lançamento, post informativo.</div>
            </div>
            <div className="step reveal">
              <div className="step-num">02</div>
              <div className="step-title">Escolha o formato</div>
              <div className="step-text">Selecione a rede social e o estilo visual. A IA adapta o criativo para cada plataforma automaticamente.</div>
            </div>
            <div className="step reveal">
              <div className="step-num">03</div>
              <div className="step-title">Gere com 1 clique</div>
              <div className="step-text">A IA cria a imagem, a legenda e as hashtags em segundos. Simples assim.</div>
            </div>
            <div className="step reveal">
              <div className="step-num">04</div>
              <div className="step-title">Poste direto</div>
              <div className="step-text">Baixe o pacote completo ou publique diretamente nas suas redes sociais com integração nativa.</div>
            </div>
          </div>
        </div>
      </div>

      <section id="precos" className="section" style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '100px' }}>
        <p className="section-label">Planos e preços</p>
        <h2 className="section-title reveal">Escolha como preferir</h2>
        <p className="section-sub reveal">Pague por créditos ou assine um plano e economize mais. Sem fidelidade.</p>

        <div className="credits-banner reveal">
          <div className="credits-icon">⚡</div>
          <div className="credits-info">
            <h3>O que são créditos Postzy?</h3>
            <p>Cada criativo gerado consome 1 crédito — isso inclui a imagem, a legenda e as hashtags. Créditos nunca expiram e podem ser acumulados com seu plano mensal.</p>
          </div>
          <div className="credits-items">
            <div className="credit-item">
              <div className="credit-val">1</div>
              <div className="credit-label">crédito = 1 criativo</div>
            </div>
            <div className="credit-item">
              <div className="credit-val">∞</div>
              <div className="credit-label">créditos não expiram</div>
            </div>
            <div className="credit-item">
              <div className="credit-val">3</div>
              <div className="credit-label">formatos por criativo</div>
            </div>
          </div>
        </div>

        <div className="pricing-grid">
          <div className="pricing-card reveal">
            <div className="plan-name">Starter</div>
            <div className="plan-price">R$49<span>/mês</span></div>
            <div className="plan-credits">🔥 30 créditos mensais</div>
            <div className="plan-divider"></div>
            <ul className="plan-features">
              <li>30 criativos por mês</li>
              <li>Instagram, Facebook e TikTok</li>
              <li>Legenda + hashtags incluídas</li>
              <li>Exportação HD</li>
              <li className="dim">Identidade de marca</li>
              <li className="dim">Integração direta nas redes</li>
              <li className="dim">Suporte prioritário</li>
            </ul>
            <button className="btn-plan btn-plan-outline">Começar agora</button>
          </div>

          <div className="pricing-card featured reveal">
            <div className="popular-badge">⭐ Mais popular</div>
            <div className="plan-name">Pro</div>
            <div className="plan-price">R$99<span>/mês</span></div>
            <div className="plan-credits">⚡ 100 créditos mensais</div>
            <div className="plan-divider"></div>
            <ul className="plan-features">
              <li>100 criativos por mês</li>
              <li>Todas as redes sociais</li>
              <li>Legenda + hashtags incluídas</li>
              <li>Exportação HD + pacote completo</li>
              <li>Identidade de marca salva</li>
              <li>Integração direta nas redes</li>
              <li className="dim">Suporte prioritário</li>
            </ul>
            <button className="btn-plan btn-plan-primary">Assinar Pro</button>
          </div>

          <div className="pricing-card reveal">
            <div className="plan-name">Agência</div>
            <div className="plan-price">R$249<span>/mês</span></div>
            <div className="plan-credits">🚀 300 créditos mensais</div>
            <div className="plan-divider"></div>
            <ul className="plan-features">
              <li>300 criativos por mês</li>
              <li>Todas as redes sociais</li>
              <li>Legenda + hashtags incluídas</li>
              <li>Exportação HD + pacote completo</li>
              <li>Múltiplas marcas/clientes</li>
              <li>Integração direta nas redes</li>
              <li>Suporte prioritário 24h</li>
            </ul>
            <button className="btn-plan btn-plan-outline">Assinar Agência</button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '32px', color: 'var(--muted)', fontSize: '0.85rem' }} className="reveal">
          Prefere pagar por uso? <a href="#" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>Compre pacotes de créditos avulsos →</a>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-glow"></div>
        <h2 className="reveal">Pronto para <span style={{ background: 'linear-gradient(135deg,var(--accent),var(--accent2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>turbinar</span><br />suas redes sociais?</h2>
        <p className="reveal">Comece grátis com 5 créditos. Sem cartão de crédito.</p>
        <Link href="/login" className="btn-primary reveal" style={{ fontSize: '1.1rem', padding: '18px 48px' }}>
          ✨ Criar meu primeiro criativo grátis
        </Link>
      </section>

      <footer>
        <div className="logo">post<span>zy</span></div>
        <div className="footer-links">
          <a href="#">Privacidade</a>
          <a href="#">Termos</a>
          <a href="#">Contato</a>
          <a href="#">Blog</a>
        </div>
        <div className="footer-copy">© 2026 Postzy. Todos os direitos reservados.</div>
      </footer>
    </>
  )
}