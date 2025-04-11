
import React, { useRef } from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Download, FileType, ImageIcon } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

interface ExportDropdownProps {
  insightsRef: React.RefObject<HTMLDivElement>;
  chartsRef: React.RefObject<HTMLDivElement>;
}

const ExportDropdown: React.FC<ExportDropdownProps> = ({ insightsRef, chartsRef }) => {
  const exportAsPDF = async () => {
    if (!insightsRef.current || !chartsRef.current) {
      toast.error("Could not find content to export");
      return;
    }

    toast.info("Preparing PDF export...");
    
    try {
      // Create new PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Export insights
      const insightsCanvas = await html2canvas(insightsRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const insightsImgData = insightsCanvas.toDataURL('image/png');
      const insightsImgWidth = pageWidth - 20;
      const insightsImgHeight = (insightsCanvas.height * insightsImgWidth) / insightsCanvas.width;
      
      pdf.text("Generated Insights", 10, 10);
      pdf.addImage(insightsImgData, 'PNG', 10, 15, insightsImgWidth, insightsImgHeight);
      
      // Add charts on the next page
      pdf.addPage();
      
      const chartsCanvas = await html2canvas(chartsRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const chartsImgData = chartsCanvas.toDataURL('image/png');
      const chartsImgWidth = pageWidth - 20;
      const chartsImgHeight = (chartsCanvas.height * chartsImgWidth) / chartsCanvas.width;
      
      pdf.text("Dashboard Charts", 10, 10);
      pdf.addImage(chartsImgData, 'PNG', 10, 15, chartsImgWidth, chartsImgHeight);
      
      // Save the PDF
      pdf.save(`insights-dashboard-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("PDF export completed!");
    } catch (error) {
      console.error("PDF export failed:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  const exportAsPNG = async () => {
    if (!chartsRef.current) {
      toast.error("Could not find charts to export");
      return;
    }

    toast.info("Preparing PNG export...");
    
    try {
      const canvas = await html2canvas(chartsRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const link = document.createElement('a');
      link.download = `dashboard-charts-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast.success("PNG export completed!");
    } catch (error) {
      console.error("PNG export failed:", error);
      toast.error("Failed to generate PNG. Please try again.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportAsPDF} className="cursor-pointer">
          <FileType className="h-4 w-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsPNG} className="cursor-pointer">
          <ImageIcon className="h-4 w-4 mr-2" />
          Export as PNG (charts only)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportDropdown;
