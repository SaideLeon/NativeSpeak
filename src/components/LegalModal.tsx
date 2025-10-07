import React from 'react';
import Modal from './Modal';

interface LegalModalProps {
  docType: 'privacy' | 'terms';
  onClose: () => void;
}

const PrivacyPolicy = () => (
  <>
    <h2>Política de Privacidade</h2>
    <p>Última atualização: {new Date().toLocaleDateString('pt-MZ')}</p>

    <h3>1. Introdução</h3>
    <p>
      Bem-vindo ao NativeSpeak. Sua privacidade é importante para nós. Esta
      Política de Privacidade explica como coletamos, usamos, e protegemos suas
      informações quando você utiliza nossa aplicação.
    </p>

    <h3>2. Informações que Coletamos</h3>
    <ul>
      <li>
        <strong>Informações da Conta:</strong> Quando você se registra,
        coletamos e armazenamos seu nome, sobrenome e endereço de e-mail em nossos servidores seguros para criar e gerenciar sua conta.
      </li>
      <li>
        <strong>Dados da Aplicação:</strong> Para personalizar sua experiência e permitir que você continue
        de onde parou, salvamos dados como seu histórico de conversas, progresso de lições e conquistas. Esta informação
        é armazenada localmente no seu navegador usando a tecnologia{' '}
        <code>localStorage</code>.
      </li>
    </ul>

    <h3>3. Como Usamos Suas Informações</h3>
    <p>Utilizamos as informações coletadas para:</p>
    <ul>
      <li>Fornecer, manter e proteger nosso serviço.</li>
      <li>Personalizar sua experiência de aprendizado.</li>
      <li>Sincronizar seu progresso e preferências no dispositivo que você usa.</li>
    </ul>

    <h3>4. Armazenamento de Dados</h3>
    <p>
      Suas informações de conta (nome, e-mail) são armazenadas em nossos servidores. Outros dados, como histórico de conversas e progresso, são armazenados de forma segura no <code>localStorage</code> do seu navegador.
      A comunicação com a API Gemini para processar suas conversas de áudio em tempo real é feita de forma segura.
    </p>

    <h3>5. Seus Direitos</h3>
    <p>
      Você tem controle sobre os dados armazenados localmente. Você pode limpar o cache e os dados do seu navegador a qualquer
      momento para remover permanentemente seu histórico e informações de sessão. Para solicitar a exclusão dos dados da sua conta de nossos servidores, por favor, entre em contato conosco.
    </p>

    <h3>6. Contato</h3>
    <p>
      Se tiver alguma dúvida sobre esta Política de Privacidade, entre em
      contato com:
      <br />
      <strong>Saide Omar Saide</strong>
      <br />
      Email:{' '}
      <a href="mailto:saideomarsaideleon@gmail.com">
        saideomarsaideleon@gmail.com
      </a>
      <br />
      Telefone: +258 86 330 4793
    </p>
  </>
);

const TermsOfUse = () => (
  <>
    <h2>Termos de Uso e Obrigações</h2>
    <p>Última atualização: {new Date().toLocaleDateString('pt-MZ')}</p>

    <h3>1. Aceitação dos Termos</h3>
    <p>
      Ao acessar e usar o NativeSpeak, você aceita e concorda em estar vinculado
      pelos termos e disposições deste acordo.
    </p>

    <h3>2. Obrigações do Usuário</h3>
    <p>
      Você concorda em usar o NativeSpeak de forma responsável e apenas para
      fins de aprendizado de idiomas. Você não deve:
    </p>
    <ul>
      <li>Usar o serviço para qualquer finalidade ilegal ou não autorizada.</li>
      <li>
        Tentar interferir ou comprometer a integridade ou segurança do sistema.
      </li>
      <li>Fornecer informações falsas ou enganosas durante o registro.</li>
    </ul>

    <h3>3. Propriedade Intelectual</h3>
    <p>
      O Serviço e seu conteúdo original, recursos e funcionalidades são e
      permanecerão propriedade exclusiva do NativeSpeak e seus licenciadores.
    </p>

    <h3>4. Isenção de Garantias</h3>
    <p>
      O serviço é fornecido "COMO ESTÁ", sem garantias de qualquer tipo,
      expressas ou implícitas. Não garantimos que o serviço será ininterrupto,
      seguro ou livre de erros.
    </p>

    <h3>5. Limitação de Responsabilidade</h3>
    <p>
      Em nenhuma circunstância o NativeSpeak, nem seus diretores ou
      funcionários, serão responsáveis por quaisquer danos indiretos,
      incidentais, especiais, consequenciais ou punitivos resultantes do seu
      acesso ou uso do serviço.
    </p>

    <h3>6. Contato</h3>
    <p>
      Para quaisquer dúvidas sobre estes Termos de Uso, entre em contato com:
      <br />
      <strong>Saide Omar Saide</strong>
      <br />
      Email:{' '}
      <a href="mailto:saideomarsaideleon@gmail.com">
        saideomarsaideleon@gmail.com
      </a>
      <br />
      Telefone: +258 86 330 4793
    </p>
  </>
);

const LegalModal: React.FC<LegalModalProps> = ({ docType, onClose }) => {
  return (
    <Modal onClose={onClose}>
      <div className="legal-modal-content">
        {docType === 'privacy' ? <PrivacyPolicy /> : <TermsOfUse />}
      </div>
    </Modal>
  );
};

export default LegalModal;