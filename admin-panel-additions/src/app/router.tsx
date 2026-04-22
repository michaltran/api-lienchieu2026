import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Home from "../pages/Home";
import Articles from "../pages/Articles";
import ArticleDetail from "../pages/ArticleDetail";
import Appointment from "../pages/Appointment";
import Drugs from "../pages/Drugs";
import Doctors from "../pages/Doctors";
import DoctorDetail from "../pages/DoctorDetail";
import DrugDetail from "../pages/DrugDetail";
import Contact from "../pages/Contact";
import VideoLibrary from "../pages/VideoLibrary";
import QualityManagement from "../pages/QualityManagement";
import Search from "../pages/Search";
import SpecialtyHub from "../pages/SpecialtyHub";
import DepartmentDetail from "../pages/DepartmentDetail";
import SimpleContentPage from "../components/layout/SimpleContentPage";
import PhotoLibrary from "../pages/PhotoLibrary";
import SuMenhTamNhin from "../pages/intro/SuMenhTamNhin";
import SoDoBenhVien from "../pages/intro/SoDoBenhVien";
import OrgStructure from "../pages/intro/OrgStructure";
import HealthKnowledge from "../pages/activities/HealthKnowledge";
import HealthPostDetail from "../pages/activities/HealthPostDetail";
import VaccineConsult from "../pages/patients/VaccineConsult";
import ProcedureGuide from "../pages/patients/ProcedureGuide";
import ServicePricing from "../pages/patients/ServicePricing";
import Policies from "../pages/patients/Policies";
import CharityBridge from "../pages/patients/CharityBridge";
import ReaderMailbox from "../pages/patients/ReaderMailbox";
import LabResults from "../pages/patients/LabResults";
import ImagingResults from "../pages/patients/ImagingResults";
import PatientPostDetail from "../pages/patients/PatientPostDetail";
import PatientSatisfactionSurvey from "../pages/activities/PatientSatisfactionSurvey";
import TrainingResearch from "../pages/activities/TrainingResearch";
import Procurement from "../pages/activities/Procurement";
import AdminReform from "../pages/activities/AdminReform";
import Recruitment from "../pages/activities/Recruitment";
import HealthCheck from "../pages/activities/HealthCheck";
import ChucNangNhiemVu from "../pages/intro/ChucNangNhiemVu";
import QuaTrinhHinhThanh from "../pages/intro/QuaTrinhHinhThanh";
import PrivacyCommitment from "../pages/legal/PrivacyCommitment";
import TeamCredits from "../pages/about/TeamCredits";
import AboutWebsite from "../pages/about/AboutWebsite";
import VR360 from "../pages/VR360";

// Admin pages (cũ)
import AdminLayout from "../components/layout/AdminLayout";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminPostList from "../pages/admin/AdminPostList";
import AdminPostEditor from "../pages/admin/AdminPostEditor";
import AnalyticsDashboard from "../pages/admin/AnalyticsDashboard";

// Admin pages (mới bổ sung)
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminMenus from "../pages/admin/AdminMenus";
import AdminBanners from "../pages/admin/AdminBanners";
import AdminMediaLibrary from "../pages/admin/AdminMediaLibrary";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminSettings from "../pages/admin/AdminSettings";
import AdminAppointments from "../pages/admin/AdminAppointments";
import {
  AdminCategories, AdminPages, AdminDepartments,
  AdminDoctors, AdminServices, AdminDrugs,
  AdminMessages, AdminLogs,
} from "../pages/admin/AdminCrudPages";

import NotFound from "../pages/NotFound";

export const router = createBrowserRouter([
  // Admin Login (no layout)
  { path: "/admin/login", element: <AdminLogin /> },

  // Admin (layout with sidebar)
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "analytics", element: <AnalyticsDashboard /> },

      // Nội dung
      { path: "posts", element: <AdminPostList /> },
      { path: "posts/:id", element: <AdminPostEditor /> },
      { path: "categories", element: <AdminCategories /> },
      { path: "pages", element: <AdminPages /> },
      { path: "menus", element: <AdminMenus /> },
      { path: "banners", element: <AdminBanners /> },
      { path: "media", element: <AdminMediaLibrary /> },

      // Bệnh viện
      { path: "departments", element: <AdminDepartments /> },
      { path: "doctors", element: <AdminDoctors /> },
      { path: "services", element: <AdminServices /> },
      { path: "drugs", element: <AdminDrugs /> },

      // Tương tác
      { path: "appointments", element: <AdminAppointments /> },
      { path: "messages", element: <AdminMessages /> },

      // Hệ thống
      { path: "users", element: <AdminUsers /> },
      { path: "settings", element: <AdminSettings /> },
      { path: "logs", element: <AdminLogs /> },
    ],
  },

  // Frontend website
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "nguoi-benh",
        children: [
          { path: "tu-van-tiem-chung-vac-xin", element: <VaccineConsult /> },
          { path: "huong-dan-quy-trinh-kham-chua-benh", element: <ProcedureGuide /> },
          { path: "bang-gia-dich-vu", element: <ServicePricing /> },
          { path: "che-do-chinh-sach", element: <Policies /> },
          { path: "nhip-cau-nhan-ai", element: <CharityBridge /> },
          { path: "hop-thu-ban-doc", element: <ReaderMailbox /> },
          { path: "ket-qua-xet-nghiem", element: <LabResults /> },
          { path: "ket-qua-chan-doan-hinh-anh", element: <ImagingResults /> },
          { path: ":category/:slug", element: <PatientPostDetail /> },
        ],
      },
      {
        path: "chuyen-khoa",
        children: [
          { index: true, element: <Home /> },
          { path: ":block", element: <SpecialtyHub /> },
          { path: ":block/:slug", element: <DepartmentDetail /> },
        ],
      },
      { path: "chuyen-gia-y-te", element: <Doctors /> },
      { path: "chuyen-gia-y-te/:slug", element: <DoctorDetail /> },
      { path: "bai-viet", element: <Articles /> },
      { path: "bai-viet/:slug", element: <ArticleDetail /> },
      { path: "dang-ky-kham", element: <Appointment /> },
      { path: "thuoc", element: <Drugs /> },
      { path: "thuoc/:slug", element: <DrugDetail /> },
      { path: "lien-he", element: <Contact /> },
      { path: "thu-vien/video", element: <VideoLibrary /> },
      { path: "thu-vien/hinh-anh", element: <PhotoLibrary /> },
      { path: "hoat-dong/quan-ly-chat-luong", element: <QualityManagement /> },
      { path: "tim-kiem", element: <Search /> },
      { path: "gioi-thieu/su-menh-tam-nhin", element: <SuMenhTamNhin /> },
      { path: "gioi-thieu/chuc-nang-nhiem-vu", element: <ChucNangNhiemVu /> },
      { path: "gioi-thieu/nhan-dien-thuong-hieu", element: <SimpleContentPage title="Nhận diện thương hiệu" parentLabel="Giới thiệu" /> },
      { path: "gioi-thieu/so-do-benh-vien", element: <SoDoBenhVien /> },
      { path: "gioi-thieu/co-cau-to-chuc", element: <OrgStructure /> },
      { path: "gioi-thieu/ban-giam-doc", element: <OrgStructure /> },
      { path: "gioi-thieu/so-do-to-chuc", element: <OrgStructure /> },
      { path: "gioi-thieu/qua-trinh-hinh-thanh-phat-trien", element: <QuaTrinhHinhThanh /> },
      { path: "hoat-dong/tin-tuc-su-kien", element: <Articles /> },
      { path: "hoat-dong/tin-tuc-su-kien/:slug", element: <ArticleDetail /> },
      { path: "hoat-dong/y-hoc-thuong-thuc", element: <HealthKnowledge /> },
      { path: "hoat-dong/y-hoc-thuong-thuc/:slug", element: <HealthPostDetail /> },
      { path: "hoat-dong/dao-tao-nckh", element: <TrainingResearch /> },
      { path: "hoat-dong/dau-thau-mua-sam", element: <Procurement /> },
      { path: "hoat-dong/cai-cach-hanh-chinh", element: <AdminReform /> },
      { path: "hoat-dong/kham-suc-khoe", element: <HealthCheck /> },
      { path: "hoat-dong/khao-sat-hai-long-nguoi-benh", element: <PatientSatisfactionSurvey /> },
      { path: "hoat-dong/tuyen-dung", element: <Recruitment /> },
      { path: "hoat-dong/dao-tao-nckh/:slug", element: <ArticleDetail /> },
      { path: "hoat-dong/dau-thau-mua-sam/:slug", element: <ArticleDetail /> },
      { path: "hoat-dong/cai-cach-hanh-chinh/:slug", element: <ArticleDetail /> },
      { path: "hoat-dong/tuyen-dung/:slug", element: <ArticleDetail /> },
      { path: "cam-ket-bao-mat", element: <PrivacyCommitment /> },
      { path: "nguoi-thuc-hien", element: <TeamCredits /> },
      { path: "gioi-thieu-website", element: <AboutWebsite /> },
      { path: "vr360", element: <VR360 /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
