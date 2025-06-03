import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Aluno } from '../models/Aluno';
import { Professor } from '../models/Professor';

const JWT_SECRET = process.env.JWT_SECRET || 'segredo123';

export const login = async (req: Request, res: Response) => {
  const { identificador, senha } = req.body;

  try {
    let usuario: any = await Professor.findOne({ where: { matricula: identificador } });
    let tipo = 'professor';

    if (!usuario) {
      usuario = await Aluno.findOne({ where: { matricula: identificador } });
      tipo = 'aluno';
    }

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Senha inválida' });
    }

    // ✅ Pega o tipo diretamente do usuário (se existir no banco)
    const payload = { id: usuario.id, nome: usuario.nome, tipo: usuario.tipo ?? tipo };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });

    res.json({ token, usuario: payload });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ erro: 'Erro interno no login' });
  }
};

export const ping = (req: Request, res: Response) => {
    try {
        res.status(200).json({ pong: true });
    } catch (error) {
        console.error('Deu erro ai tio', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const ehPar = (numero: number) => {
    if (numero % 2 == 0) {
        return true;
    }
    return false;
}

export const converterParaBinario = (numero: number) => {
    return numero.toString(2);
}

export const mediaArray = (numeros: number[]) => {
    let res = 0;
    numeros.forEach(element => {
        res += element;
    });
    return res / numeros.length;
}

export const contarPalavras = (frase: string) => {
    console.log(frase.trim().split(/\s+/).length);
    return frase.trim().split(/\s+/).length;
}

export const validarCEP = (cep: string) => {
    cep = cep.replace(/\D/g, '');
    var validar = /^[0-9]{8}$/;

    console.log(validar.test(cep));
    return validar.test(cep);
}

export const verificarSenhaForte = (senha: string) => {

    let res = false;
    if (senha.length >= 8 && validaNumeroSenha(senha) && validaCaracterEspecialSenha(senha) && validaCaracterSenha(senha)) {
        res = true
    }

    return { res, senha };
}

export const validaNumeroSenha = (senha: string) => {
    for (let i = 0; i < senha.length; i++) {
        if (!isNaN(parseInt(senha[i])) && senha[i] !== ' ') {
            console.log(`O caractere '${senha[i]}' na posição ${i} é um número.`);
            return true;
        }
    }

    return false;
}


export const validaCaracterEspecialSenha = (senha: string) => {
    const regexCaracterEspecial = /[!@#$%^&*(),.?":{}|<>]/;

    if (regexCaracterEspecial.test(senha)) {
        return true;
    } else {
        return false;
    }
}

export const validaCaracterSenha = (senha: string) => {
    const temMaiuscula = /[A-Z]/.test(senha);
    const temMinuscula = /[a-z]/.test(senha);

    if (temMaiuscula && temMinuscula) {
        return true;
    } else {
        return false;
    }
}
