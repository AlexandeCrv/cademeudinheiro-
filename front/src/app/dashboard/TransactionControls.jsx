import { jsPDF } from "jspdf";
import { Search, Download } from "lucide-react";
export default function TransactionControls({
  searchTerm,
  setSearchTerm,
  activeFilter,
  setActiveFilter,
  transactions,
}) {
  const getLogoAsBase64 = () => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = "/logoCFundo.png"; // Caminho do logo na pasta public
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/png"); // Converte a imagem para base64
        resolve(dataURL);
      };
      img.onerror = reject;
    });
  };

  const handleDownload = async () => {
    const doc = new jsPDF();

    const pageHeight = doc.internal.pageSize.height; // Altura da página
    const margin = 10; // Margem da página
    const headerHeight = 30; // Altura do cabeçalho
    const footerHeight = 40; // Altura do rodapé
    const lineHeight = 12; // Altura de cada linha de transação
    const fontSize = 12; // Tamanho da fonte

    let currentY = headerHeight; // Inicia na posição logo abaixo do cabeçalho

    // Carrega o logo
    const logoBase64 = await getLogoAsBase64(); // Aguarda a conversão da imagem

    // Cabeçalho
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");

    // Adiciona o logo na primeira página
    doc.addImage(logoBase64, "PNG", margin, currentY - 10, 20, 20); // Adiciona o logo no topo à esquerda

    // Nome do App e Título
    doc.text("CadêMeuDinheiro?", margin + 30, currentY); // Nome do app, um pouco à direita do logo
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Relatório de Transações Recentes", margin + 30, currentY + 10);

    // Adiciona a data e hora de geração do PDF
    const now = new Date();
    const formattedDate = now.toLocaleDateString(); // Formato de data
    const formattedTime = now.toLocaleTimeString(); // Formato de hora
    doc.setFontSize(10);
    doc.text(
      `Gerado em: ${formattedDate} às ${formattedTime}`,
      margin + 30,
      currentY + 20
    );

    // Linha separadora para o cabeçalho
    doc.setLineWidth(0.5);
    doc.line(margin, currentY + 25, doc.internal.pageSize.width - margin, currentY + 25);
    currentY += headerHeight + 5; // Avança a posição Y para onde as transações começam

    // Definindo a fonte e tamanho das transações
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", "normal");

    // Formatação do corpo das transações
    transactions.forEach((transaction, index) => {
      const title = transaction.title || "Sem título";
      let amount = transaction.amount;
      if (amount && typeof amount === "object" && amount.$numberDecimal) {
        amount = Number(amount.$numberDecimal).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      } else {
        amount = amount || "Sem valor";
      }

      const createdAt = transaction.createdAt
        ? new Date(transaction.createdAt).toLocaleDateString()
        : "Sem data";

      // Inserir texto formatado
      doc.text(`${title} - ${amount} - ${createdAt}`, margin, currentY);
      currentY += lineHeight;

      // Verificando se há espaço suficiente para continuar, caso contrário, cria nova página
      if (currentY + lineHeight + footerHeight > pageHeight) {
        doc.addPage();
        currentY = headerHeight; // Resetando para a altura do cabeçalho

        // Cabeçalho da nova página
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("CadêMeuDinheiro?", margin + 30, currentY); // Nome do app
        doc.setFontSize(14);
        doc.setFont("helvetica", "normal");
        doc.text("Relatório de Transações Recentes", margin + 30, currentY + 10);
        doc.setLineWidth(0.5);
        doc.line(
          margin,
          currentY + 15,
          doc.internal.pageSize.width - margin,
          currentY + 15
        );
        currentY += headerHeight; // Avança para as transações

        // Adiciona o logo na segunda página (mesmo posicionamento da primeira página)
        doc.addImage(logoBase64, "PNG", margin, currentY - 10, 20, 20); // Adiciona o logo na segunda página
      }
    });

    // Rodapé com informações de contato
    const footerY = pageHeight - footerHeight;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    doc.text("Contato:", margin, footerY);
    doc.text("E-mail: alexandecarvalho318@gmail.com", margin, footerY + 5);
    doc.text(
      "LinkedIn: https://www.linkedin.com/in/alexandre-carvalho-4b178a26b/",
      margin,
      footerY + 10
    );

    // Linha de separação no rodapé
    doc.setLineWidth(0.5);
    doc.line(margin, footerY - 3, doc.internal.pageSize.width - margin, footerY - 3);

    // Salvar o arquivo PDF
    doc.save("transacoes_recentes.pdf");
  };
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar transações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-900 border border-purple-900/50 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full md:w-64"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 self-end md:self-auto">
        <div className="flex items-center gap-2 bg-gray-900 border border-purple-900/50 rounded-lg p-1">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1 rounded ${
              activeFilter === "all"
                ? "bg-purple-600 text-white"
                : "text-gray-400 hover:text-purple-400"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setActiveFilter("entrada")}
            className={`px-3 py-1 rounded ${
              activeFilter === "entrada"
                ? "bg-green-600 text-white"
                : "text-gray-400 hover:text-green-400"
            }`}
          >
            Entradas
          </button>
          <button
            onClick={() => setActiveFilter("saida")}
            className={`px-3 py-1 rounded ${
              activeFilter === "saida"
                ? "bg-red-600 text-white"
                : "text-gray-400 hover:text-red-400"
            }`}
          >
            Saídas
          </button>
        </div>

        <button
          onClick={handleDownload}
          className="p-2 bg-gray-900 border border-purple-900/50 rounded-lg text-gray-400 hover:text-purple-400"
        >
          <Download className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
