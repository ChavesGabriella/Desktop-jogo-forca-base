const elementos = {
    telaInicial: document.getElementById('inicial'),
    telaCadastro: document.getElementById('cadastro'),
    telaJogo: document.getElementById('jogo'),
    telaMensagem: document.querySelector('.mensagem'),
    textoMensagem: document.querySelector('.mensagem .texto'),
    teclado: document.querySelector('.teclado'),
    palavra: document.querySelector('.palavra'),
    dica: document.querySelector('.dica'),

    botoes: {
        facil: document.querySelector('.botao-facil'),
        medio: document.querySelector('.botao-medio'),
        dificil: document.querySelector('.botao-dificil'),
        cadastrar: document.querySelector('.botao-cadastrar'),
        realizarCadastro: document.querySelector('.botao-realizar-cadastro'),
        voltar: document.querySelector('.botao-voltar'),
        reiniciar: document.querySelector('.reiniciar')
    },

    campos: {
        dificuldade:{
            facil: document.getElementById('facil'),
            medio: document.getElementById('medio'),
            dificil: document.getElementById('dificil')
        },
        palavra: document.getElementById('palavra'),
        dica: document.getElementById('dica')
    },

    boneco: [
        document.querySelector('.boneco-cabeca'),
        document.querySelector('.boneco-corpo'),
        document.querySelector('.boneco-braco-esquerdo'),
        document.querySelector('.boneco-braco-direito'),
        document.querySelector('.boneco-perna-esquerda'),
        document.querySelector('.boneco-perna-direita'),
    ]
};

const palavras = {
    facil: [{
        palavra: 'serie',
        dica: 'Game Of Thrones é a melhor ...'
    },
    {
        palavra: 'ímpar',
        dica: 'Se não é par é ...'
    },
    {
        palavra: 'poder',
        dica: 'Querer não é ...'
    },
    {
        palavra: 'sonho',
        dica: 'Temos quando vamos dormir'
    }],
    medio: [{
        palavra: 'recesso',
        dica: 'acontece quando o feriado é no meio da semana'
    },
    {
        palavra: 'traidor',
        dica: 'judas foi'
    },
    {
        palavra: 'moleque',
        dica: 'errei, fui ...'
    }],
    dificil: [{
        palavra: 'hipócrita',
        dica: 'reclama de algo mas faz igual'
    },
    {
        palavra: 'recíproco',
        dica: 'todos querem um amor ...'
    },
    {
        palavra: 'sufocante',
        dica: 'lugar muito fechado é ...'
    }]
};

function criarTeclado(){
    const letras = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    elementos.teclado.textContent = '';

    for(const letra of letras){
        const button = document.createElement('button');

        button.appendChild(document.createTextNode(letra.toUpperCase()));

        button.classList.add(`botao-${letra}`);

        elementos.teclado.appendChild(button);

        button.addEventListener('click', () =>{
            selecionarLetra(letra);
        });
    }
};

function mostrarErro(){
    const parte = elementos.boneco[5 - jogo.chances];

    parte.classList.remove('escondido');
};

function mostrarMensagem(vitoria){
    const mensagem = vitoria ? '<p>Parabens!</p><p>Você GANHOU!</p>' : '<p>Que pena!</p><p>Você PERDEU!</p>';

    elementos.textoMensagem.innerHTML = mensagem;

    elementos.telaMensagem.style.display = 'flex';

    elementos.telaMensagem.classList.add(`mensagem-${vitoria ? 'vitoria' : 'derrota'}`);

    jogo.emAndamento = false;
}

function abrirTelaCadastroPalavra(){
    elementos.telaInicial.style.display = 'none';
    elementos.telaCadastro.style.display = 'flex';
}

function voltarInicio(){
    novoJogo();
}

function cadastrarPalvara(){
    const novaPalavra = elementos.campos.palavra.value;
    const novaDica = elementos.campos.dica.value;

    var novaDificuldade = '';

    if(elementos.campos.dificuldade.facil.checked){
        novaDificuldade = 'facil';
        //palavras.facil.palavra.push(novaPalavra);
        //palavras.facil.dica.push(novaDica);
        palavras.facil.push({palavra: novaPalavra, dica: novaDica});
        console.log("Palavras; ", palavras.facil);
    }else if(elementos.campos.dificuldade.medio.checked){
        novaDificuldade = 'medio';
        palavras.medio.push({palavra: novaPalavra, dica: novaDica});
        console.log("Palavras; ", palavras.medio);
    }else if(elementos.campos.dificuldade.dificil.checked){
        novaDificuldade = 'dificil';
        palavras.dificil.push({palavra: novaPalavra, dica: novaDica});
        console.log("Palavras; ", palavras.dificil);
    }

    console.log("palavra: ", novaPalavra);
    console.log("dica: ", novaDica);
    console.log("dificuldade", novaDificuldade);

    confirm("Nova palavra cadastrada com sucesso!");
    
}

function sortearPalavra(){
    const i = Math.floor(Math.random() * palavras[jogo.dificuldade].length);

    const palavra = palavras[jogo.dificuldade][i].palavra;
    const dica = palavras[jogo.dificuldade][i].dica;

    jogo.definirPalavra(palavra, dica);

    console.log(jogo.palavra.original);
    console.log(jogo.palavra.dica);

    return jogo.palavra.original;
}

function mostrarPalavra(){
    elementos.dica.textContent = jogo.palavra.dica;

    elementos.palavra.textContent = '';

    for(let i=0; i<jogo.acertos.length; i++){
        const letra = jogo.acertos[i].toUpperCase();

        elementos.palavra.innerHTML += `<div class = "letra-${i}">${letra}</div>`;
    }
}

function novoJogo(){
    jogo = {
        dificuldade: undefined,
        palavra: {
            original: undefined,
            semAcentos: undefined,
            tamanho: undefined,
            dica: undefined,
        },
        acertos: undefined,
        jogadas: [],
        chances: 6,

        definirPalavra: function(palavra, dica){
            this.palavra.original = palavra;
            this.palavra.tamanho = palavra.length;
            this.acertos = '';

            this.palavra.semAcentos = this.palavra.original.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            this.palavra.dica = dica;

            for(let i=0; i<this.palavra.tamanho; i++){
                this.acertos += ' ';
            }
        },

        jogar: function(letraJogada){
            let acertou = false;
            for(let i=0; i < this.palavra.tamanho; i++){
                const letra = this.palavra.semAcentos[i].toLowerCase();
                if(letra === letraJogada.toLowerCase()){
                    acertou = true;

                    this.acertos = substituirCaractere(this.acertos, i, this.palavra.original[i]);
                }
            }

            if(!acertou){
                this.chances--;
            }

            return acertou;
        },

        ganhou: function(){
            return !this.acertos.includes(' ');
        },
        perdeu: function(){
            return this.chances <= 0;
        },
        acabou: function(){
            return this.ganhou() || this.perdeu();
        },
        emAndamento: false
    };

    elementos.telaInicial.style.display = 'flex';
    elementos.telaCadastro.style.display = 'none';
    elementos.telaJogo.style.display = 'none';
    elementos.telaMensagem.style.display = 'none';
    elementos.telaMensagem.classList.remove('mensagem-vitoria');
    elementos.telaMensagem.classList.remove('mensagem-derrota');

    for(const parte of elementos.boneco){
        parte.classList.remove('escondido');
        parte.classList.add('escondido');
    }

    criarTeclado();
}

function selecionarLetra(letra){
    if(!jogo.jogadas.includes(letra) && !jogo.acabou()){
        const acertou = jogo.jogar(letra);

        jogo.jogadas.push(letra);

        const button = document.querySelector(`.botao-${letra}`);
        button.classList.add(acertou ? 'certo' : 'errado');

        mostrarPalavra();

        if(!acertou){
            mostrarErro();
        }

        if(jogo.ganhou()){
            mostrarMensagem(true);
        }else if(jogo.perdeu()){
            mostrarMensagem(false);
        }
    }
}

function iniciarJogo(dificuldade){
    jogo.dificuldade = dificuldade;

    elementos.telaInicial.style.display = 'none';
    elementos.telaJogo.style.display = 'flex';

    jogo.emAndamento = true;

    sortearPalavra();
    mostrarPalavra();
}

function substituirCaractere(str, indice, novoCaractere){
    const parteAntes = str.substring(0, indice);
    const parteDepois = str.substring(indice + 1);
    const novaString = parteAntes + novoCaractere + parteDepois;

    return novaString;
}

novoJogo();
elementos.botoes.facil.addEventListener('click', () => iniciarJogo('facil'));
elementos.botoes.medio.addEventListener('click', () => iniciarJogo('medio'));
elementos.botoes.dificil.addEventListener('click', () => iniciarJogo('dificil'));
elementos.botoes.reiniciar.addEventListener('click', ()=> novoJogo());
elementos.botoes.voltar.addEventListener('click', () => voltarInicio());
elementos.botoes.cadastrar.addEventListener('click', () => abrirTelaCadastroPalavra());
elementos.botoes.realizarCadastro.addEventListener('click', () => cadastrarPalvara());
