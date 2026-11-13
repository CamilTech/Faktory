// INFORMAÇÕES DOS INTEGRANTES

const integrantes = [
  {
    nome: "Camila Santos",
    cargo: "Designer, Programadora Front-End",
    foto: "https://i.pinimg.com/736x/4a/6f/e8/4a6fe8f64bba07c5212d73c5098a8a90.jpg",
    descricao: "Sou designer e programadora Front-End, responsável por transformar ideias em interfaces visuais funcionais, intuitivas e agradáveis. Gosto de unir criatividade e tecnologia para desenvolver experiências digitais."
  },

  {
    nome: "Cristiano Thiago",
    cargo: "Programador Full-Stack",
    foto: "https://i.pinimg.com/736x/08/43/67/0843673fb1a3887556593d28cfb433d1.jpg",
    descricao: "Sou programador Full-Stack e trabalho no desenvolvimento de aplicações, atuando tanto no Front-End quanto no Back-End. Tenho interesse em criar soluções eficientes, explorar novas tecnologias e desenvolver sistemas que atendam às necessidades dos usuários."
  },

  {
    nome: "Arthur Sonsin",
    cargo: "Diretor de projeto",
    foto: "https://i.pinimg.com/1200x/cf/5a/c5/cf5ac5776eb001de2afdfeb4ab0f1bcf.jpg",
    descricao: "Sou responsável pela direção e organização do projeto, acompanhando as etapas de desenvolvimento e garantindo que as atividades sejam realizadas de maneira organizada. Busco manter a equipe alinhada e os objetivos bem definidos."
  },

  {
    nome: "Bruno Marçal",
    cargo: "Administrador de Banco de Dados",
    foto: "https://i.pinimg.com/736x/59/aa/33/59aa3395d6d06ab25f482de45118e9b5.jpg",
    descricao: "Sou responsável pela administração e organização dos bancos de dados do projeto. Trabalho com armazenamento, gerenciamento e estruturação das informações, buscando garantir a integridade, a segurança e o bom funcionamento dos dados."
  }

];


// ELEMENTOS HTML

const indicadores = document.querySelectorAll(".indicador");

const foto = document.querySelector("#foto-integrante");
const nome = document.querySelector("#nome-integrante");
const cargo = document.querySelector("#cargo-integrante");
const descricao = document.querySelector("#descricao-integrante");


// CONFIGURAÇÕES

let integranteAtual = 0;
let intervalo;

const tempoCarregamento = 6000;


// ATUALIZA OS INDICADORES

function atualizarIndicadores() {

  indicadores.forEach((indicador, index) => {

    indicador.classList.remove("ativo", "concluido");

    indicador.setAttribute(
      "aria-pressed",
      index === integranteAtual ? "true" : "false"
    );

    // Integrantes anteriores ficam azuis

    if (index < integranteAtual) {
      indicador.classList.add("concluido");
    }

    // Integrante atual fica verde

    if (index === integranteAtual) {
      indicador.classList.add("ativo");
    }

    // Próximos permanecem roxos

  });

}


// ATUALIZA AS INFORMAÇÕES

function selecionarIntegrante(index) {

  integranteAtual = index;

  const integrante = integrantes[index];

  // Foto

  foto.src = integrante.foto;
  foto.alt = `Foto de ${integrante.nome}`;

  // Nome

  nome.textContent = integrante.nome;

  // Cargo

  cargo.textContent = integrante.cargo;

  // Sobre mim

  descricao.textContent = integrante.descricao;

  // Indicadores

  atualizarIndicadores();

  // Reinicia o carregamento

  iniciarCarregamento();

}


// AVANÇA PARA O PRÓXIMO INTEGRANTE

function proximoIntegrante() {

  const proximo = (integranteAtual + 1) % integrantes.length;

  selecionarIntegrante(proximo);

}


// INICIA O CARREGAMENTO AUTOMÁTICO

function iniciarCarregamento() {

  clearInterval(intervalo);

  intervalo = setInterval(() => {

    proximoIntegrante();

  }, tempoCarregamento);

}


// CLIQUE NOS INDICADORES

indicadores.forEach((indicador) => {

  indicador.addEventListener("click", () => {

    const index = Number(indicador.dataset.index);

    selecionarIntegrante(index);

  });

});


// INICIA A APRESENTAÇÃO

selecionarIntegrante(0);