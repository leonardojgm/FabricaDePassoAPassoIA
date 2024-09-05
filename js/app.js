
const resultadosPesquisa = document.getElementById('resultados-pesquisa');
const campoPesquisa = document.getElementById('campo-pesquisa');
const botaoPesquisa = document.getElementById('botao-pesquisa');

campoPesquisa.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    exibirPassoAPasso();
  }
});

botaoPesquisa.addEventListener('click', () => {
  exibirPassoAPasso();
});

async function exibirPassoAPasso() {
  const itemResultado = document.createElement('div');

  document.getElementById('loader').style.display = 'block';

  // Construindo o prompt
  let prompt = `
    Você é um resolvedor de problema e deve apresentar um passo a passo para o problema:
    ${campoPesquisa.value}.
    Este problema deve ser apresentado como uma lista de itens númerados (ex.: Passo 1. Item 1, Passo 2. Item 2, Passo 3. Item 3).
    Caso você não consiga responder deve solicitar mais informações sobre o problema.
    A resposta tem que vir formatada para HTML.`;
  
  // Criando o objeto a ser enviado no corpo da requisição
  const body = {
    prompt: prompt
  };

  try {
    // Fazendo a requisição POST
    const response = await fetch('https://mini-integracao-api-gemini.vercel.app/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`Erro ao fazer a requisição: ${response.statusText}`);
    }

    const passoAPasso = await response.json();

    document.getElementById('loader').style.display = 'none';

    itemResultado.innerHTML = `
    Parar resolver o problema: <b>${campoPesquisa.value}</b>
    Você deve:
    ${passoAPasso}`;

    itemResultado.classList.add('item-resultado');
  
    resultadosPesquisa.appendChild(itemResultado);
  } catch (error) {
    console.error('Erro:', error);

    await new Promise(resolve => setTimeout(resolve, 10000));

    return exibirPassoAPasso();
  }
}