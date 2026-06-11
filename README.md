# 🥬 Feira Express — Combate ao Desperdício Alimentar

<p align="center">
  <img src="https://img.shields.io/badge/Status-Conclu%C3%ADdo-brightgreen?style=for-the-badge&logo=github" alt="Status Concluído">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
</p>

<p align="center">
  <strong>Uma plataforma SPA (Single Page Application) focada na sustentabilidade e no comércio local.</strong><br>
  Conectamos feirantes locais a consumidores conscientes, promovendo a venda de excedentes agrícolas ("sobras do dia") com descontos dinâmicos para evitar o descarte desnecessário de alimentos.
</p>

---

## 🎯 Sobre o Projeto

O **Feira Express** foi desenhado com base em dois pilares fundamentais: a **sustentabilidade** e a **acessibilidade**. O sistema simula um ambiente de mercado virtual completo onde o utilizador pode alternar entre duas experiências em tempo real através de um único painel.

### 🌟 Funcionalidades Principais

* **Duplo Perfil (SPA):** Alternância instantânea entre a interface do **Cliente** (compras) e o **Painel do Feirante** (gestão de stock e comandas).
* **Gestão de Stock Inteligente:** O feirante pode atualizar preços em tempo real e ativar o botão "Sobra", aplicando automaticamente 50% de desconto e destacando o produto no topo da página do cliente.
* **Carrinho Dinâmico:** Atualização reativa de quantidades, taxas de serviço, subtotal e total geral.
* **Comandas em Tempo Real:** Ao finalizar a compra, o pedido é enviado diretamente para o terminal do feirante para triagem e separação.
* **Acessibilidade Integrada:** Botões nativos para aumentar ou diminuir a fonte de todo o sistema globalmente, garantindo uma navegação inclusiva.
* **Design Responsivo:** Totalmente adaptado para computadores, tablets e smartphones.

---

## 📸 Demonstração Visual

| 📱 Interface do Cliente | 🏪 Painel de Gestão do Feirante |
| :---: | :---: |
| <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80" width="350px" alt="Demonstração Cliente"/> <br> *Vitrine de ofertas, busca e carrinho dinâmico.* | <img src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=400&q=80" width="350px" alt="Demonstração Feirante"/> <br> *Controlo de preços, ativação de descontos e comandas.* |

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando tecnologias nativas da Web, sem a necessidade de frameworks pesados, garantindo uma execução ultrarrápida:

* **HTML5:** Estruturação semântica e acessível de todas as telas do sistema.
* **CSS3:** Layout moderno utilizando *Grid* e *Flexbox*, variáveis para tipografia dinamicamente ajustável e suporte completo a `@media queries` para responsividade.
* **JavaScript (ES6+):** Lógica reativa baseada em estados, manipulação fluida do DOM, persistência de dados local com `localStorage` e algoritmos de filtragem dinâmica de produtos.

---

## 📁 Estrutura de Ficheiros

```gark
├── index.html          # Estrutura principal e definição das telas (SPA)
├── style.css           # Estilização global, animações e responsividade
├── script.js          # Lógica do carrinho, filtros e painel do feirante
└── README.md           # Documentação do repositório
