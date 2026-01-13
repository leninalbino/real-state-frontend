import { useNavigate } from "react-router-dom";
import { AppLayout } from "../../../app/layout/AppLayout";
import { AdForm } from "../components/AdForm";
import { createProperty } from "../services/propertyService";

const PublishPropertyPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    await createProperty(data);
  };

  return (
    <AppLayout hideNav>
      <div className="bg-gray-50 pt-16">
        <div className="mx-auto">
          <AdForm onCancel={() => navigate(-1)} onSubmit={handleSubmit} />
        </div>
      </div>
    </AppLayout>
  );
};

export default PublishPropertyPage;
