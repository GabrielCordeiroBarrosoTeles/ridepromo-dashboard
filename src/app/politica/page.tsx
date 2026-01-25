import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Política de Privacidade e Termos de Uso – RidePromo",
  description: "Política de Privacidade e Termos de Uso do RidePromo",
};

export default function PoliticaPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <SiteHeader variant="dashboard" />

      <article className="mx-auto max-w-3xl space-y-6 p-4 py-8 md:p-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Política de Privacidade e Termos de Uso – RidePromo
        </h1>
        <p className="text-sm text-gray-500">Última atualização: Janeiro de 2026</p>

        <p className="text-gray-700">
          A <strong>SPEED RETURN SERVIÇOS DE TECNOLOGIA E INTERMEDIAÇÃO LTDA</strong>, inscrita no
          CNPJ 31.975.213/0001-62, (&quot;RidePromo&quot;, &quot;nós&quot;) respeita a sua privacidade e segue
          as regras da Lei Geral de Proteção de Dados Pessoais (LGPD), Lei nº 13.709/2018.
        </p>
        <p className="text-gray-700">
          Ao instalar, acessar ou utilizar o RidePromo, você declara que leu, entendeu e aceitou
          esta Política e os Termos. Caso não concorde com qualquer condição, não prossiga com a
          instalação ou uso do aplicativo.
        </p>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">1. Definições</h2>
          <p className="mb-2 text-gray-700">Para fins deste documento, aplicam-se as seguintes definições:</p>
          <ul className="list-inside list-disc space-y-1 text-gray-700">
            <li><strong>RidePromo:</strong> aplicativo e plataforma de ofertas e sugestões de desconto voltadas para mobilidade urbana.</li>
            <li><strong>Usuário:</strong> pessoa que utiliza o aplicativo RidePromo.</li>
            <li><strong>Plataforma:</strong> ambiente digital do RidePromo em smartphones e demais interfaces relacionadas.</li>
            <li><strong>Dados Pessoais:</strong> informações que identificam ou podem identificar o usuário.</li>
            <li><strong>Logs:</strong> registros técnicos de atividade do usuário no app.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">2. Dados que coletamos</h2>
          <p className="mb-2 text-gray-700">
            Para oferecer descontos em viagens e integrar com apps de transporte de mobilidade diversos, conforme credenciamento feito pela RidePromo, poderemos coletar:
          </p>
          <h3 className="mb-1 font-medium text-gray-800">2.1 Dados de mobilidade e viagem</h3>
          <p className="mb-2 text-gray-700">
            Somente quando você utiliza aplicativos de mobilidade urbana e autoriza/permite o funcionamento no RidePromo, poderemos coletar: origem e destino da viagem; preço estimado ou final; tipo de serviço selecionado; dados relacionados ao meio de transporte (veículos como carros, motos, patinetes, bicicletas e outros). Essas informações podem ser obtidas por meio do Serviço de Acessibilidade, limitado ao contexto de mobilidade urbana.
          </p>
          <h3 className="mb-1 font-medium text-gray-800">2.2 Dados de conta (quando aplicável)</h3>
          <p className="mb-2 text-gray-700">
            Caso exista login ou cadastro, podemos coletar: nome, e-mail, telefone e identificadores fornecidos no cadastro.
          </p>
          <h3 className="mb-1 font-medium text-gray-800">2.3 Logs e dados técnicos (uso e segurança)</h3>
          <p className="mb-2 text-gray-700">
            Para fins de segurança, prevenção de fraudes e melhoria do aplicativo, podemos coletar logs como: endereço IP do dispositivo; modelo do aparelho e sistema operacional; data e hora de uso; tempo de uso no aplicativo; identificadores técnicos necessários para funcionamento e diagnóstico.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">3. Como usamos os dados</h2>
          <p className="mb-2 text-gray-700">Os dados coletados são utilizados para:</p>
          <ul className="list-inside list-disc space-y-1 text-gray-700">
            <li>Calcular, exibir e sugerir descontos em viagens</li>
            <li>Melhorar a experiência e desempenho do app</li>
            <li>Garantir estabilidade e operação do serviço</li>
            <li>Prevenir fraudes e proteger o usuário</li>
            <li>Responder solicitações e suporte técnico</li>
            <li>Cumprir obrigações legais e regulatórias</li>
            <li>Gerar análises estatísticas para entender uso e preferências</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">4. Permissões especiais e Serviço de Acessibilidade</h2>
          <p className="text-gray-700">
            O RidePromo pode solicitar permissões especiais, incluindo permissão relacionada ao Serviço de Acessibilidade, para funcionar corretamente. Ao prosseguir, o usuário declara ciência e autoriza que o RidePromo capture informações de uso em aplicativos de mobilidade urbana e leia apenas dados necessários para análise de rota/preço/tipo de serviço. O RidePromo limita-se à captura apenas de informações relevantes à atividade de mobilidade urbana, não coletando conteúdos sensíveis ou dados não relacionados a essa finalidade, em conformidade com a LGPD (Lei nº 13.709/2018). Esses dados não são utilizados para finalidades fora do funcionamento do RidePromo, e não serão vendidos, comercializados ou repassados para empresas externas.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">5. Comunicação com o usuário</h2>
          <p className="text-gray-700">
            Quando forem detectadas oportunidades ou descontos relevantes, o RidePromo poderá entrar em contato e enviar sugestões por: WhatsApp, E-mail, SMS, Telegram, Ligação telefônica (de acordo com a regra de negócio vigente do RidePromo e preferências disponíveis ao usuário quando aplicável).
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">6. Compartilhamento e armazenamento</h2>
          <p className="text-gray-700">
            Os dados coletados são armazenados em nossa infraestrutura de datacenter, aplicando medidas de segurança, controle de acesso e práticas compatíveis com a legislação brasileira. Não vendemos dados a terceiros. Poderemos compartilhar dados somente quando houver obrigação legal, ordem judicial ou solicitação válida de autoridade competente.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">7. Retenção de dados</h2>
          <p className="text-gray-700">
            O RidePromo poderá reter determinados registros e dados pelo tempo necessário para cumprir obrigações legais, atender auditorias, exercer e resguardar direitos, e prevenir fraudes e abusos. Após o período necessário, os dados poderão ser eliminados ou anonimizados.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">8. Exclusão de conta e dados</h2>
          <p className="text-gray-700">
            O usuário pode solicitar a exclusão do seu cadastro a qualquer momento, diretamente pelo menu do aplicativo. Após a solicitação, os dados e o histórico do usuário serão excluídos de forma irreversível, exceto nos casos em que a retenção seja exigida por obrigação legal, regulatória ou proteção de direitos.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">9. Direitos do titular (LGPD)</h2>
          <p className="text-gray-700">
            Nos termos da Lei nº 13.709/2018 (LGPD), você pode solicitar: acesso aos dados, correção, exclusão, portabilidade e informações sobre tratamento.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">10. Segurança</h2>
          <p className="text-gray-700">
            Adotamos medidas técnicas e organizacionais para proteger os dados e reduzir riscos. Nenhum sistema é 100% imune a falhas, e o RidePromo se compromete a atuar com responsabilidade conforme a legislação vigente em caso de incidentes.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">11. Atualizações desta política</h2>
          <p className="text-gray-700">
            Podemos atualizar esta Política e Termos a qualquer momento. Alterações relevantes poderão ser informadas no aplicativo ou por outros meios. O uso continuado após mudanças representa aceite da versão vigente.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">12. Contato</h2>
          <p className="text-gray-700">
            Em caso de dúvidas, solicitações ou pedidos sobre privacidade e dados pessoais:
          </p>
          <p className="mt-2 text-gray-700">
            <strong>SPEED RETURN SERVIÇOS DE TECNOLOGIA E INTERMEDIAÇÃO LTDA</strong><br />
            CNPJ: 31.975.213/0001-62<br />
            E-mail:{" "}
            <a href="mailto:ridepromo@704apps.com.br" className="text-[#fd6c13] underline">
              ridepromo@704apps.com.br
            </a>
          </p>
          <p className="mt-2 text-sm text-gray-500">Documento Versão: 1.0 – 24/01/2026</p>
        </section>

        <div className="border-t pt-6">
          <Link href="/" className="text-[#fd6c13] hover:underline">
            ← Voltar ao Dashboard
          </Link>
        </div>
      </article>
    </main>
  );
}
