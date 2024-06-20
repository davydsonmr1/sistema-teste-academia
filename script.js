document.addEventListener('DOMContentLoaded', function() {
    const formCadastrarAluno = document.getElementById('form-cadastrar-aluno');
    const formPlanoTreino = document.getElementById('form-plano-treino');
    const listaAlunos = document.getElementById('lista-alunos');
    const selectAluno = document.getElementById('select-aluno');
    const btnPesquisar = document.getElementById('btn-pesquisar');
    const inputPesquisarNome = document.getElementById('pesquisar-nome');
    const inputSeries = document.getElementById('series');
    const inputRepeticoes = document.getElementById('repeticoes');
    const btnAdicionarTreino = document.getElementById('btn-adicionar-treino');
    const inputExercicio = document.getElementById('input-exercicio'); // corrigido para funcionar com o id certo 
    const selectDiaSemana = document.getElementById('select-dia-semana');

    const btnCadastro = document.getElementById('btn-cadastro');
    const btnTreino = document.getElementById('btn-treino');
    const btnAlunos = document.getElementById('btn-alunos');

    const telaCadastro = document.getElementById('cadastro-aluno');
    const telaTreino = document.getElementById('plano-treino');
    const telaAlunos = document.getElementById('dados-alunos');

    const modalPlanoTreino = document.getElementById('modal-plano-treino');
    const modalTitulo = document.getElementById('modal-titulo');
    const detalhesPlanoTreino = document.getElementById('detalhes-plano-treino');
    const spanClose = document.querySelector('.close');
    
    const detalhesAlunoModal = document.getElementById('detalhes-aluno');
    const detalhesAlunoContent = document.getElementById('detalhes-aluno-content');
    const spanCloseDetalhes = detalhesAlunoModal.querySelector('.close');

    function mostrarTela(tela) {
        telaCadastro.style.display = 'none';
        telaTreino.style.display = 'none';
        telaAlunos.style.display = 'none';
        tela.style.display = 'block';
    }

    btnCadastro.addEventListener('click', () => mostrarTela(telaCadastro));
    btnTreino.addEventListener('click', () => mostrarTela(telaTreino));
    btnAlunos.addEventListener('click', () => mostrarTela(telaAlunos));
    mostrarTela(telaCadastro);

    let alunos = [];

    carregarAlunos();

    formCadastrarAluno.addEventListener('submit', function(event) {
        event.preventDefault();

        const nome = document.getElementById('nome').value;
        const telefone = document.getElementById('telefone').value;
        const dataVencimento = document.getElementById('data-vencimento').value;
        const altura = document.getElementById('altura').value;
        const peso = document.getElementById('peso').value;
        const idade = document.getElementById('idade').value;
        const foto = document.getElementById('foto').files[0];

        const aluno = {
            nome,
            telefone,
            dataVencimento,
            altura,
            peso,
            idade,
            foto: foto ? URL.createObjectURL(foto) : null,
            treinos: {}
        };

        alunos.push(aluno);
        salvarAlunos();
        exibirAlunos();
        atualizarSelectAluno();
        formCadastrarAluno.reset();
    });

    btnAdicionarTreino.addEventListener('click', function(event) {
        event.preventDefault();
    
        const index = selectAluno.selectedIndex;
        const alunoSelecionado = alunos[index];
        const exercicio = inputExercicio.value; // Corrigido para ler o valor do campo input-exercicio
        const diaSemana = selectDiaSemana.value;
        const series = inputSeries.value;
        const repeticoes = inputRepeticoes.value;
    
        const treino = {
            exercicio,
            series,
            repeticoes
        };
    
        if (!alunoSelecionado.treinos[diaSemana]) {
            alunoSelecionado.treinos[diaSemana] = [];
        }
        alunoSelecionado.treinos[diaSemana].push(treino);
        salvarAlunos();
        exibirAlunos();
        inputSeries.value = '';
        inputRepeticoes.value = '';
    });
    

    btnPesquisar.addEventListener('click', function() {
        const nomePesquisa = inputPesquisarNome.value.toLowerCase();
        const alunosFiltrados = alunos.filter(aluno => aluno.nome.toLowerCase().includes(nomePesquisa));
        exibirAlunos(alunosFiltrados);
    });

    function exibirAlunos(alunosParaExibir = alunos) {
        listaAlunos.innerHTML = '';
        alunosParaExibir.forEach((aluno, index) => {
            const alunoCard = document.createElement('div');
            alunoCard.classList.add('aluno-card');
            const img = document.createElement('img');
            if (aluno.foto) {
                img.src = aluno.foto;
                img.alt = aluno.nome;
            } else {
                img.src = 'img/default-avatar.jpg';
                img.alt = 'Foto não disponível';
            }
            const nomeAluno = document.createElement('p');
            nomeAluno.textContent = aluno.nome;
            const telefoneAluno = document.createElement('p');
            telefoneAluno.textContent = aluno.telefone;
            const idadeAluno = document.createElement('p');
            idadeAluno.textContent = `Idade: ${aluno.idade}`;
            const btnDetalhes = document.createElement('button');
            btnDetalhes.textContent = 'Ver Plano de Treino';
            btnDetalhes.classList.add('btn-detalhes');
            btnDetalhes.addEventListener('click', function() {
                exibirPlanoTreino(index);
            });
            const btnDadosAluno = document.createElement('button');
            btnDadosAluno.textContent = 'Dados do Aluno';
            btnDadosAluno.classList.add('btn-dados-aluno');
            btnDadosAluno.addEventListener('click', function() {
                exibirDetalhesAluno(index);
            });
            const btnExcluir = document.createElement('button');
            btnExcluir.textContent = 'Excluir Aluno';
            btnExcluir.classList.add('btn-excluir');
            btnExcluir.addEventListener('click', function() {
                excluirAluno(index);
            });

            alunoCard.appendChild(img);
            alunoCard.appendChild(nomeAluno);
            alunoCard.appendChild(telefoneAluno);
            alunoCard.appendChild(idadeAluno);
            alunoCard.appendChild(btnDetalhes);
            alunoCard.appendChild(btnDadosAluno);
            alunoCard.appendChild(btnExcluir);

            listaAlunos.appendChild(alunoCard);
        });

        atualizarSelectAluno();
    }

    function atualizarSelectAluno() {
        selectAluno.innerHTML = '';
        alunos.forEach((aluno, index) => {
            const option = document.createElement('option');
            option.value = index.toString();
            option.textContent = aluno.nome;
            selectAluno.appendChild(option);
        });
    }

    function exibirPlanoTreino(index) {
        const alunoSelecionado = alunos[index];
        modalTitulo.textContent = `Plano de Treino de ${alunoSelecionado.nome}`;
        detalhesPlanoTreino.innerHTML = '';

        const diasSemana = ["1", "2", "3", "4", "5", "6", "7"];
        const nomeDiasSemana = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"];

        diasSemana.forEach((dia, idx) => {
            const diaTreino = alunoSelecionado.treinos[dia];
            if (diaTreino) {
                const diaContainer = document.createElement('div');
                diaContainer.classList.add('dia-container');

                const tituloDia = document.createElement('h3');
                tituloDia.textContent = nomeDiasSemana[idx];

                // Ícone para excluir dia
                const iconExcluirDia = document.createElement('span');
                iconExcluirDia.innerHTML = '&times;';
                iconExcluirDia.classList.add('icon-excluir-dia');
                iconExcluirDia.addEventListener('click', () => excluirDiaTreino(index, dia));

                tituloDia.appendChild(iconExcluirDia);

                diaContainer.appendChild(tituloDia);

                diaTreino.forEach((treino, treinoIdx) => {
                    const treinoContainer = document.createElement('div');
                    treinoContainer.classList.add('treino-container');

                    const textoTreino = document.createElement('span');
                    textoTreino.textContent = `${treino.exercicio}: ${treino.series} séries de ${treino.repeticoes} repetições`;

                    // Ícone para excluir exercício
                    const iconExcluirTreino = document.createElement('span');
                    iconExcluirTreino.innerHTML = '&times;';
                    iconExcluirTreino.classList.add('icon-excluir-treino');
                    iconExcluirTreino.addEventListener('click', () => excluirTreino(index, dia, treinoIdx));

                    treinoContainer.appendChild(textoTreino);
                    treinoContainer.appendChild(iconExcluirTreino);

                    diaContainer.appendChild(treinoContainer);
                });

                detalhesPlanoTreino.appendChild(diaContainer);
            }
        });

        modalPlanoTreino.style.display = 'block';
    }

    spanClose.onclick = function() {
        modalPlanoTreino.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target === modalPlanoTreino) {
            modalPlanoTreino.style.display = 'none';
        }
    };

    function excluirAluno(index) {
        alunos.splice(index, 1);
        salvarAlunos();
        exibirAlunos();
    }

    function excluirDiaTreino(alunoIndex, dia) {
        delete alunos[alunoIndex].treinos[dia];
        salvarAlunos();
        exibirPlanoTreino(alunoIndex);
    }

    function excluirTreino(alunoIndex, dia, treinoIdx) {
        alunos[alunoIndex].treinos[dia].splice(treinoIdx, 1);
        if (alunos[alunoIndex].treinos[dia].length === 0) {
            delete alunos[alunoIndex].treinos[dia];
        }
        salvarAlunos();
        exibirPlanoTreino(alunoIndex);
    }

    function salvarAlunos() {
        localStorage.setItem('alunos', JSON.stringify(alunos));
    }

    function carregarAlunos() {
        const alunosJSON = localStorage.getItem('alunos');
        if (alunosJSON) {
            alunos = JSON.parse(alunosJSON);
            exibirAlunos();
        }
    }

    function exibirDetalhesAluno(index) {
        const alunoSelecionado = alunos[index];
        detalhesAlunoContent.innerHTML = '';
        const tituloDetalhes = document.createElement('h2');
        tituloDetalhes.textContent = `Detalhes do Aluno: ${alunoSelecionado.nome}`;
        detalhesAlunoContent.appendChild(tituloDetalhes);

        const listaDetalhes = document.createElement('ul');
        const itensDetalhes = [
            `Nome: ${alunoSelecionado.nome}`,
            `Telefone: ${alunoSelecionado.telefone}`,
            `Data de Vencimento: ${alunoSelecionado.dataVencimento}`,
            `Altura: ${alunoSelecionado.altura} cm`,
            `Peso: ${alunoSelecionado.peso} kg`,
            `Idade: ${alunoSelecionado.idade} anos`
        ];

        itensDetalhes.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            listaDetalhes.appendChild(li);
        });

        detalhesAlunoContent.appendChild(listaDetalhes);
        detalhesAlunoModal.style.display = 'block';
    }

    spanCloseDetalhes.onclick = function() {
        detalhesAlunoModal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target === detalhesAlunoModal) {
            detalhesAlunoModal.style.display = 'none';
        }
    };

    const btnAdicionarCampo = document.getElementById('btn-adicionar-campo');
    const formCadastroAluno = document.getElementById('form-cadastrar-aluno');

    btnAdicionarCampo.addEventListener('click', function(event) {
        event.preventDefault();

        const tituloCampo = document.getElementById('titulo-campo').value;
        const novoCampo = document.createElement('div');
        novoCampo.classList.add('form-group');

        const label = document.createElement('label');
        label.textContent = tituloCampo;

        const input = document.createElement('input');
        input.type = 'text';
        input.classList.add('input-text');

        const btnRemover = document.createElement('button');
        btnRemover.textContent = 'X';
        btnRemover.classList.add('btn-remover-campo');
        btnRemover.addEventListener('click', function() {
            novoCampo.remove();
        });

        novoCampo.appendChild(label);
        novoCampo.appendChild(input);
        novoCampo.appendChild(btnRemover);

        formCadastroAluno.appendChild(novoCampo);
    });

});

