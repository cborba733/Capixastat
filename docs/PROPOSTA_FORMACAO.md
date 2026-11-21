# Formação — avaliação e proposta (Rodada 2, 21/11/2026)

## 1. Opinião sincera
A Formação tem uma parte **sólida e real** — Registro diário (sRPE e bem-estar/Hooper), ACWR como alerta, microciclos
salvos e a tela "Meu dia" do atleta — e uma parte que **não deveria estar num sistema profissional**:

- **Antropometria**: todos os números (bíceps, tórax, quadríceps, panturrilha, % de gordura, flexibilidade) eram
  **gerados a partir do nome e da idade do atleta**, e um "Score Físico" era calculado em cima deles. Mesmo com o aviso
  "simulado", isso é dado inventado com cara de medida. **Corrigido nesta rodada** (ver abaixo).
- **Evolução Física**: peso e flexibilidade das últimas 8 semanas também são simulados.
- **Sessões / Microciclo de exemplo**: aparecem como "EXEMPLO", mas misturam-se ao que é real.
- Falta **protocolo padronizado**: profissionais seguem o padrão **ISAK** para medidas (perímetros e dobras cutâneas,
  lado direito, média de 2–3 medidas) e baterias fixas de testes físicos (salto CMJ, sprint 10/30 m, Yo-Yo IR1, RAST).
- Os dados físicos estão espalhados: maturação no Perfil (F6), carga na Formação, nada de testes físicos.

## 2. Proposta (prioridade × dificuldade)
| # | Mudança | Prioridade | Dificuldade |
|---|---|---|---|
| FM1 | **Antropometria real**: corpo em SVG (frente/costas) com regiões clicáveis; só medidas registradas (ISAK: perímetros e dobras), histórico e variação; % de gordura só como **estimativa** com equação citada | Alta | Média |
| FM2 | Remover dados simulados da **Evolução Física** (mostrar só o que foi medido: peso das avaliações, testes) | Alta | Baixa |
| FM3 | **Testes físicos** com protocolo (CMJ, sprint 10/30 m, Yo-Yo IR1) e comparação com o elenco | Média | Média |
| FM4 | **Monotonia e strain** (Foster) a partir do sRPE já registrado | Média | Baixa |
| FM5 | **Perfil físico único** do atleta (maturação + antropometria + testes + carga) | Média | Média |
| FM6 | Relatório semanal de carga em PDF para a comissão | Baixa | Média |
| FM7 | Corpo **3D** girando 360° (Three.js + modelo anatômico de licença livre) | Baixa | Alta |

### Sobre o 3D (FM7)
Viável tecnicamente (Three.js + glTF + clique por *raycasting*), mas **não até terça com qualidade**: é preciso achar um
modelo anatômico com licença que permita uso e **regiões separadas** (ex.: projetos de licença Creative Commons como
Z-Anatomy, CC BY-SA), reduzir o tamanho para web, mapear cada região às medidas ISAK, citar a fonte e testar. Fica em
Trabalhos futuros. A versão SVG entrega o mesmo valor de uso (clicar na região e ver as medidas) e não depende de
arquivo externo.

## 3. O que foi implementado nesta rodada
- **FM1** completo (ver CLAUDE.md, item R2-5).
- O restante vai para Trabalhos futuros.

## Referências usadas
- ISAK — International Society for the Advancement of Kinanthropometry: padrão de perímetros e dobras cutâneas.
- Jackson, A. S.; Pollock, M. L. (1978). Generalized equations for predicting body density of men. *British Journal of
  Nutrition*, 40, 497–504. — Jackson, Pollock & Ward (1980), versão para mulheres. (equações de 3 dobras)
- Siri, W. E. (1961). Body composition from fluid spaces and density. — conversão densidade → % de gordura.
- Foster, C. et al. (2001). A new approach to monitoring exercise training. *J Strength Cond Res*, 15(1). (sRPE, monotonia)
