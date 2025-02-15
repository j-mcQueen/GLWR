import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import AllClients from "./AllClients";
import Header from "./Header";
import AddClient from "./AddClient";
import DeleteModal from "./DeleteModal";
import Actions from "./Actions";
import EditClient from "./EditClient";
import RejectedFiles from "./modals/RejectedFiles";
import Notice from "./modals/Notice";
import AddLinks from "./AddLinks";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = "ADMIN DASHBOARD — GOOD LUCK WHITE RABBIT";
  }, []);

  const host =
    import.meta.env.VITE_ENV === "production"
      ? import.meta.env.VITE_API_URL
      : "http://localhost:3000/api";

  const [activePane, setActivePane] = useState("ALL");
  const [clients, setClients] = useState([]);
  const [targetClient, setTargetClient] = useState({});

  const [clientFilterResult, setClientFilterResult] = useState([]);
  const [rejectedFiles, setRejectedFiles] = useState([]);
  const [deleteModalToggle, setDeleteModalToggle] = useState({
    active: false,
    target: "",
    name: "",
  });

  const [notice, setNotice] = useState<{
    status: boolean;
    message: string;
    logout: { status: boolean; path: string | null };
  }>({
    status: false,
    message: "",
    logout: { status: false, path: null },
  });

  useEffect(() => {
    const getAllClients = async () => {
      try {
        const response = await fetch(`${host}/admin/users`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();

        if (data) {
          location.state.login = false; // ensures fn does not rerun after login

          switch (response.status) {
            case 200:
            case 304:
              return setClients(data);

            case 401:
              setNotice({
                status: true,
                message:
                  "Your session has expired, so we're logging you out to keep things secure. Please login again to continue.",
                logout: { status: true, path: "/admin" },
              });
              break;

            default:
              throw new TypeError("Server rejected request.");
          }
        }
      } catch (err) {
        setNotice({
          status: true,
          message:
            "There was an unexpected error. We are logging you out to keep things secure. Please log back in and try again. If the problem persists, contact Jack.",
          logout: { status: true, path: "/admin" },
        });
      }
    };

    if (location.state.login === true) getAllClients(); // if admin has just logged in, fetch clients
  }, [location, navigate, host]);

  return (
    <main className="w-[calc(100dvw-1.5rem-2px)] h-[calc(100dvh-1.5rem-2px)] overflow-scroll relative">
      {rejectedFiles.length > 0 ? (
        <RejectedFiles
          rejectedFiles={rejectedFiles}
          setRejectedFiles={setRejectedFiles}
        />
      ) : null}

      <AnimatePresence>
        {notice.status && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Notice notice={notice} setNotice={setNotice} />
          </motion.div>
        )}
      </AnimatePresence>

      <Header
        host={host}
        edit={activePane === "EDIT" ? true : false}
        setTargetClient={activePane === "EDIT" ? setTargetClient : false}
        setActivePane={activePane === "EDIT" ? setActivePane : false}
      />

      <section className="flex justify-center items-center text-white">
        <>
          {activePane === "ALL" ? (
            <div className="text-white border border-solid border-white w-[40dvw]">
              <Actions
                clients={clients}
                setClients={setClients}
                setClientFilterResult={setClientFilterResult}
                setActivePane={setActivePane}
              />

              <AllClients
                clients={
                  clientFilterResult.length > 0 ? clientFilterResult : clients
                }
                notice={notice}
                setNotice={setNotice}
                setActivePane={setActivePane}
                setTargetClient={setTargetClient}
                setDeleteModalToggle={setDeleteModalToggle}
              />
            </div>
          ) : activePane === "ADD" ? (
            <AddClient
              host={host}
              clients={clients}
              setClients={setClients}
              setActivePane={setActivePane}
            />
          ) : activePane === "EDIT" ? (
            <EditClient
              clients={clients}
              setClients={setClients}
              host={host}
              setNotice={setNotice}
              targetClient={targetClient}
              setTargetClient={setTargetClient}
              setActivePane={setActivePane}
            />
          ) : activePane === "LINKS" ? (
            <AddLinks
              setActivePane={setActivePane}
              setClients={setClients}
              clients={clients}
              targetClient={targetClient}
            />
          ) : null}
        </>
      </section>

      {deleteModalToggle.active === true ? (
        <DeleteModal
          host={host}
          clients={clients}
          setClients={setClients}
          deleteModalToggle={deleteModalToggle}
          setDeleteModalToggle={setDeleteModalToggle}
        />
      ) : null}
    </main>
  );
}
