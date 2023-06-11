import { Box, Grid } from "@mui/material";
import { nanoid } from "nanoid";
import { FC, useEffect, useState } from "react";

import { useDisclosure } from "@/hooks/useDiscloure";

import CvItem from "../CvItem";
import ModalDetailCv from "../ModalDetailCv";

const CvTemplates: FC = () => {
  const [data, setData] = useState<TCvTemplate[]>([]);
  const [template, setTemplate] = useState<TCvTemplate>({});
  const modalDetailCv = useDisclosure();

  const handleSelectTemplate = (template: TCvTemplate) => {
    setTemplate(template);
    modalDetailCv.handleOpen();
  };

  useEffect(() => {
    const getData = () => {
      const fakeData: TCvTemplate[] = [
        {
          id: 1,
          name: "CV 1",
          preview: "https://cdn.enhancv.com/ivy_league_cover_letter_template_1_439b5cab58.png",
          decription: "Ngành nghề: Công nghệ thông tin",
        },
        {
          id: 2,
          name: "CV 2",
          preview:
            "https://marketplace.canva.com/EAFRuCp3DcY/1/0/1131w/canva-black-white-minimalist-cv-resume-f5JNR-K5jjw.jpg",
          decription: "Ngành nghề: Kinh doanh",
        },
      ];
      setData(fakeData);
    };
    getData();
  }, []);
  return (
    <Box>
      <h4>Các mẫu CV</h4>

      <Grid
        container
        columnSpacing={2}
        sx={{
          mt: "10px",
        }}
      >
        {data?.map((item: TCvTemplate) => (
          <Grid item xs={3} key={nanoid()}>
            <CvItem cvTemplate={item} handleSelectTemplate={handleSelectTemplate} />
          </Grid>
        ))}
      </Grid>
      <ModalDetailCv
        isOpen={modalDetailCv.isOpen}
        handleOpenModal={modalDetailCv.handleToggle}
        data={template}
      />
    </Box>
  );
};

export default CvTemplates;
