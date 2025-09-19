import { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import axios from "axios";
import { Eye, Edit2, Trash2, Plus } from "lucide-react";

import MainCard from "components/MainCard";
import { Button, Modal, Form, InputGroup } from "react-bootstrap";

export default function BasicDataTable() {
  const tableRef = useRef(null);
  const [fgNames, setFgNames] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedFG, setSelectedFG] = useState(null);

  // Dropdown states
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mounts, setMounts] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [colors, setColors] = useState([]);
  const [codePrefixes, setCodePrefixes] = useState([]);
  const [primaryNames, setPrimaryNames] = useState([]);
  const [secondaryNames, setSecondaryNames] = useState([]);
  const [wattOptions, setWattOptions] = useState([]);

  const excludedFields = ["updatedAt", "createdAt"];
  const columnNames = { id: "ID", product_name: "FG Name", product_code: "FG Code" };

  const [formData, setFormData] = useState({
    brand_id: "",
    category: "",
    code_prefix: "",
    nameP: "",
    nameS: "",
    watt: [],
    mount: [],
    shape: [],
    color: [],
    description: "",
  });

  const [previewCombinations, setPreviewCombinations] = useState([]);

  // Multi-select states
  const [availableWatts, setAvailableWatts] = useState([]);
  const [selectedWatts, setSelectedWatts] = useState([]);
  const [availableMounts, setAvailableMounts] = useState([]);
  const [selectedMounts, setSelectedMounts] = useState([]);
  const [availableShapes, setAvailableShapes] = useState([]);
  const [selectedShapes, setSelectedShapes] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);

  // --- NEW STATE FOR GENERIC ADD MODAL ---
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState(""); // "brand", "category", "prefix", etc.
  const [newItem, setNewItem] = useState({ short_name: "", description: "" });

  // --- API CALLS ---
  const fetchDropdowns = async () => {
    try {
      const [
        brandsRes,
        catRes,
        prefixRes,
        colorsRes,
        mountsRes,
        primaryRes,
        secondaryRes,
        shapeRes,
        wattRes,
      ] = await Promise.all([
        axios.get("http://localhost:5000/api/fg-brands"),
        axios.get("http://localhost:5000/api/fg-categories"),
        axios.get("http://localhost:5000/api/fg-prefixs"),
        axios.get("http://localhost:5000/api/fg-colors"),
        axios.get("http://localhost:5000/api/fg-mounts"),
        axios.get("http://localhost:5000/api/fg-primary"),
        axios.get("http://localhost:5000/api/fg-secondary"),
        axios.get("http://localhost:5000/api/fg-shape"),
        axios.get("http://localhost:5000/api/fg-watt"),
      ]);

      setBrands(brandsRes.data);
      setCategories(catRes.data);
      setCodePrefixes(prefixRes.data);
      setColors(colorsRes.data);
      setMounts(mountsRes.data);
      setPrimaryNames(primaryRes.data);
      setSecondaryNames(secondaryRes.data);
      setShapes(shapeRes.data);
      setWattOptions(wattRes.data);

      setAvailableWatts(wattRes.data);
      setAvailableMounts(mountsRes.data);
      setAvailableShapes(shapeRes.data);
      setAvailableColors(colorsRes.data);
    } catch (err) {
      console.error("Dropdown fetch failed:", err);
    }
  };

  const fetchFGNames = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/fg-name");
      setFgNames(res.data);
    } catch (err) {
      console.error("FG Names fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchDropdowns();
    fetchFGNames();
  }, []);

  // Initialize DataTable
  useEffect(() => {
    if (fgNames.length) {
      const table = $(tableRef.current).DataTable({
        responsive: true,
        pageLength: 10,
        lengthMenu: [5, 10, 25, 50],
        autoWidth: false,
        columnDefs: [{ orderable: false, targets: -1 }],
      });
      return () => table.destroy(true);
    }
  }, [fgNames]);

  const tableHeaders = fgNames[0]
    ? Object.keys(fgNames[0]).filter((key) => !excludedFields.includes(key))
    : [];

  // --- Modal Handlers ---
  const handleAddNew = () => {
    setIsEditMode(false);
    setFormData({
      brand_id: "",
      category: "",
      code_prefix: "",
      nameP: "",
      nameS: "",
      watt: [],
      mount: [],
      shape: [],
      color: [],
      description: "",
    });
    setSelectedWatts([]);
    setSelectedMounts([]);
    setSelectedShapes([]);
    setSelectedColors([]);
    setPreviewCombinations([]);
    setShowModal(true);
  };

  // const handleEdit = (fg) => {
  //   setIsEditMode(true);
  //   setSelectedFG(fg);

  //   const watts = fg.watt ? [{ id: 0, short_name: fg.watt, description: "" }] : [];
  //   const mount = fg.mount ? [{ id: 0, short_name: fg.mount, description: "" }] : [];
  //   const shape = fg.shape ? [{ id: 0, short_name: fg.shape, description: "" }] : [];
  //   const color = fg.color ? [{ id: 0, short_name: fg.color, description: "" }] : [];

  //   setSelectedWatts(watts);
  //   setAvailableWatts(wattOptions.filter((w) => !watts.some((sw) => sw.short_name === w.short_name)));

  //   setSelectedMounts(mount);
  //   setAvailableMounts(mounts.filter((m) => !mount.some((sm) => sm.short_name === m.short_name)));

  //   setSelectedShapes(shape);
  //   setAvailableShapes(shapes.filter((s) => !shape.some((ss) => ss.short_name === s.short_name)));

  //   setSelectedColors(color);
  //   setAvailableColors(colors.filter((c) => !color.some((sc) => sc.short_name === c.short_name)));

  //   setFormData({
  //     brand_id: fg.brand_id || "",
  //     category: fg.category || "",
  //     code_prefix: fg.code_prefix || "",
  //     nameP: fg.nameP || "",
  //     nameS: fg.nameS || "",
  //     watt: watts,
  //     mount: mount,
  //     shape: shape,
  //     color: color,
  //     description: fg.description || "",
  //   });

  //   generatePreview({
  //     ...fg,
  //     watt: watts,
  //     mount: mount,
  //     shape: shape,
  //     color: color,
  //   });
  //   setShowModal(true);
  // };


  const handleEdit = (fg) => {
  setIsEditMode(true);
  setSelectedFG(fg);

  // 🔑 Find actual option objects by matching what FG has
  const watts = fg.watt
    ? wattOptions.filter((w) => w.short_name === fg.watt || w.description === fg.watt)
    : [];
  const mountsSelected = fg.mount
    ? mounts.filter((m) => m.short_name === fg.mount || m.description === fg.mount)
    : [];
  const shapesSelected = fg.shape
    ? shapes.filter((s) => s.short_name === fg.shape || s.description === fg.shape)
    : [];
  const colorsSelected = fg.color
    ? colors.filter((c) => c.short_name === fg.color || c.description === fg.color)
    : [];

  // Update multi-selects
  setSelectedWatts(watts);
  setAvailableWatts(wattOptions.filter((w) => !watts.some((sw) => sw.id === w.id)));

  setSelectedMounts(mountsSelected);
  setAvailableMounts(mounts.filter((m) => !mountsSelected.some((sm) => sm.id === m.id)));

  setSelectedShapes(shapesSelected);
  setAvailableShapes(shapes.filter((s) => !shapesSelected.some((ss) => ss.id === s.id)));

  setSelectedColors(colorsSelected);
  setAvailableColors(colors.filter((c) => !colorsSelected.some((sc) => sc.id === c.id)));

  // Main form values should store IDs or whole objects (not plain strings)
  setFormData({
    brand_id: fg.fg_brand_id || "",
    category: fg.fg_category_id || "",
    code_prefix: fg.fg_prefix_id || "",
    nameP: primaryNames.find((pn) => pn.id === fg.fg_primary_id) || "",
    nameS: secondaryNames.find((sn) => sn.id === fg.fg_secondary_id) || "",
    watt: watts,
    mount: mountsSelected,
    shape: shapesSelected,
    color: colorsSelected,
    description: fg.description || "",
  });

  // Preview based on real option objects
  generatePreview({
    ...fg,
    watt: watts,
    mount: mountsSelected,
    shape: shapesSelected,
    color: colorsSelected,
  });

  setShowModal(true);
};




  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FG?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/fg-name/${id}`);
      fetchFGNames();
    } catch (err) {
      console.error(err);
    }
  };

const generateFGCombinations = (data) => {
  const brandId = brands.find((b) => b.description === data.brand_id)?.id;
  const brandname = brands.find((b) => b.description === data.brand_id)?.short_name;
  const categoryId = categories.find((c) => c.description === data.category)?.id;
  const categoryName = categories.find((c) => c.description === data.category)?.short_name;
  const prefixId = codePrefixes.find((p) => p.description === data.code_prefix)?.id;
  const prefixName = codePrefixes.find((p) => p.description === data.code_prefix)?.short_name;
  const primaryId = data.nameP?.id || null;
  const primaryName = data.nameP?.short_name || null;
  const secondaryId = data.nameS?.id || null;
  const secondaryName = data.nameS?.short_name || null;

  let combos = [];

  const watts = data.watt.length ? data.watt : [{ id: null, short_name: "" }];
  const mounts = data.mount.length ? data.mount : [{ id: null, short_name: "" }];
  const shapes = data.shape.length ? data.shape : [{ id: null, short_name: "" }];
  const colors = data.color.length ? data.color : [{ id: null, short_name: "" }];

  watts.forEach((w) => {
    mounts.forEach((m) => {
      shapes.forEach((s) => {
        colors.forEach((c) => {
          let fgCode = `${brandname || ""}${categoryName || ""}${prefixName || ""}${primaryName || ""}${secondaryName || ""}${w.short_name || ""}${m.short_name || ""}${s.short_name || ""}${c.short_name || ""}`;
          
              // ✅ Ensure max length 18
          if (fgCode.length > 18) {
            fgCode = fgCode.substring(0, 18);
          } else if (fgCode.length < 18) {
            fgCode = fgCode.padEnd(18, "X"); // pad with zeros
          }
          const fgName = [
            data.brand_id,
            data.category,
            data.nameP?.description,
            data.nameS?.description,
            w.description,
            m.description,
            s.description,
            c.description,
            data.description,
          ].filter(Boolean).join(" ");

          combos.push({
            fg_name: fgName,
            fg_code: fgCode,
            status: "pending_details",
            details: {
              fg_brand_id: brandId,
              fg_category_id: categoryId,
              fg_prefix_id: prefixId,
              fg_primary_id: primaryId,
              fg_secondary_id: secondaryId,
              fg_watt_id: w.id || null,
              fg_mount_id: m.id || null,
              fg_shape_id: s.id || null,
              fg_color_id: c.id || null,
              fg_text_contain: data.description || "",
            }
          });
        });
      });
    });
  });

  return combos;
};



  const generatePreview = (data) => {
    const combos = generateFGCombinations(data);
    setPreviewCombinations(combos);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const fgEntries = generateFGCombinations(formData);

  //     if (isEditMode) {
  //       await axios.put(`http://localhost:5000/api/fg-name/${selectedFG.id}`, fgEntries[0]);
  //     } else {
  //       for (const entry of fgEntries) {
  //         await axios.post("http://localhost:5000/api/fg-name", entry);
  //       }
  //     }

  //     setShowModal(false);
  //     fetchFGNames();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fgEntries = generateFGCombinations(formData);

      let createdItems = [];

      for (const entry of fgEntries) {
        // Step 1: Create FG Name
        const { details, ...fgNameData } = entry;
        const fgRes = await axios.post("http://localhost:5000/api/fg-name", fgNameData);

        // Step 2: Create FG Name Detail (linked with fg_name_id)
        const detailPayload = {
          ...details,
          fg_name_id: fgRes.data.id,
        };
        await axios.post("http://localhost:5000/api/fg-name-details", detailPayload);

        createdItems.push(fgRes.data);
      }

      setFgNames((prev) => [...prev, ...createdItems]);
      setShowModal(false);
    } catch (err) {
      console.error("Error while saving FG:", err.response?.data || err.message);
    }
  };




  const handleFormChange = (field, value) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    generatePreview(updatedData);
  };

  // --- Multi-select handlers ---
  const handleSelectOption = (field, id) => {
    if (!id) return;
    let option;

    if (field === "watt") {
      option = availableWatts.find((w) => w.id.toString() === id);
      setSelectedWatts([...selectedWatts, option]);
      setAvailableWatts(availableWatts.filter((w) => w.id !== option.id));
      handleFormChange("watt", [...selectedWatts, option]);
    } else if (field === "mount") {
      option = availableMounts.find((m) => m.id.toString() === id);
      setSelectedMounts([...selectedMounts, option]);
      setAvailableMounts(availableMounts.filter((m) => m.id !== option.id));
      handleFormChange("mount", [...selectedMounts, option]);
    } else if (field === "shape") {
      option = availableShapes.find((s) => s.id.toString() === id);
      setSelectedShapes([...selectedShapes, option]);
      setAvailableShapes(availableShapes.filter((s) => s.id !== option.id));
      handleFormChange("shape", [...selectedShapes, option]);
    } else if (field === "color") {
      option = availableColors.find((c) => c.id.toString() === id);
      setSelectedColors([...selectedColors, option]);
      setAvailableColors(availableColors.filter((c) => c.id !== option.id));
      handleFormChange("color", [...selectedColors, option]);
    }
  };

  const handleRemoveSelected = (field, option) => {
    if (field === "watt") {
      const updated = selectedWatts.filter((w) => w.id !== option.id);
      setSelectedWatts(updated);
      setAvailableWatts([...availableWatts, option]);
      handleFormChange("watt", updated);
    } else if (field === "mount") {
      const updated = selectedMounts.filter((m) => m.id !== option.id);
      setSelectedMounts(updated);
      setAvailableMounts([...availableMounts, option]);
      handleFormChange("mount", updated);
    } else if (field === "shape") {
      const updated = selectedShapes.filter((s) => s.id !== option.id);
      setSelectedShapes(updated);
      setAvailableShapes([...availableShapes, option]);
      handleFormChange("shape", updated);
    } else if (field === "color") {
      const updated = selectedColors.filter((c) => c.id !== option.id);
      setSelectedColors(updated);
      setAvailableColors([...availableColors, option]);
      handleFormChange("color", updated);
    }
  };

  // --- Handle Save New Item ---
  const handleSaveNewItem = async () => {
    try {
      let url = "";
      if (addType === "brand") url = "http://localhost:5000/api/fg-brands";
      if (addType === "category") url = "http://localhost:5000/api/fg-categories";
      if (addType === "prefix") url = "http://localhost:5000/api/fg-prefixs";
      if (addType === "primary") url = "http://localhost:5000/api/fg-primary";
      if (addType === "secondary") url = "http://localhost:5000/api/fg-secondary";
      if (addType === "watt") url = "http://localhost:5000/api/fg-watt";
      if (addType === "mount") url = "http://localhost:5000/api/fg-mounts";
      if (addType === "shape") url = "http://localhost:5000/api/fg-shape";
      if (addType === "color") url = "http://localhost:5000/api/fg-colors";

      if (!url) return;

      await axios.post(url, newItem);
      setShowAddModal(false);
      setNewItem({ short_name: "", description: "" });
      fetchDropdowns();
    } catch (err) {
      console.error("Failed to save new item:", err);
    }
  };

  return (
    <MainCard title={<h3 className="mb-0 text-center fw-bold">FG Name List</h3>}>
      <div className="d-flex justify-content-end mb-3">
        <Button variant="primary" size="sm" className="shadow-sm" onClick={handleAddNew}>
          Add FG NAME
        </Button>
      </div>

      {/* FG Table */}
      <div className="table-responsive shadow-sm rounded">
        <table
          ref={tableRef}
          className="table table-striped table-hover table-bordered align-middle"
          style={{ width: "100%" }}
        >
          <thead className="table-light">
            <tr>
              {tableHeaders.map((key) => (
                <th key={key} className="text-center text-capitalize">
                  {columnNames[key] || key}
                </th>
              ))}
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {fgNames.map((row) => (
              <tr key={row.id} className="align-middle">
                {tableHeaders.map((key) => (
                  <td key={key} className="text-center">
                    {row[key] || "-"}
                  </td>
                ))}
                <td className="text-center">
                  <div className="d-flex justify-content-center gap-2">
                    <Button variant="primary" size="sm">
                      <Eye size={16} />
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleEdit(row)}>
                      <Edit2 size={16} />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(row.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FG Main Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg" backdrop="static">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>{isEditMode ? "Edit FG" : "Add New FG"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="row g-3">
              {/* Brand */}
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>
                    Brand <span className="text-danger">*</span>
                  </Form.Label>
                  <InputGroup>
                    <Form.Select
                      value={formData.brand_id}
                      onChange={(e) => handleFormChange("brand_id", e.target.value)}
                      required
                    >
                      <option value="">Please Select</option>
                      {brands.map((b) => (
                        <option key={b.id} value={b.description}>
                          {b.short_name} - {b.description}
                        </option>
                      ))}
                    </Form.Select>
                    <Button variant="primary" size="sm" onClick={() => { setAddType("brand"); setShowAddModal(true); }}>
                      <Plus size={16} />
                    </Button>
                  </InputGroup>
                </Form.Group>
              </div>

              {/* Category */}
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <InputGroup>
                    <Form.Select
                      value={formData.category}
                      onChange={(e) => handleFormChange("category", e.target.value)}
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.description}>
                          {c.short_name} - {c.description}
                        </option>
                      ))}
                    </Form.Select>
                    <Button variant="primary" size="sm" onClick={() => { setAddType("category"); setShowAddModal(true); }}>
                      <Plus size={16} />
                    </Button>
                  </InputGroup>
                </Form.Group>
              </div>

              {/* Prefix */}
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Code Prefix</Form.Label>
                  <InputGroup>
                    <Form.Select
                      value={formData.code_prefix}
                      onChange={(e) => handleFormChange("code_prefix", e.target.value)}
                    >
                      <option value="">Select Prefix</option>
                      {codePrefixes.map((cp) => (
                        <option key={cp.id} value={cp.description}>
                          {cp.short_name} - {cp.description}
                        </option>
                      ))}
                    </Form.Select>
                    <Button variant="primary" size="sm" onClick={() => { setAddType("prefix"); setShowAddModal(true); }}>
                      <Plus size={16} />
                    </Button>
                  </InputGroup>
                </Form.Group>
              </div>

              {/* Primary Name */}
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Primary Name</Form.Label>
                  <InputGroup>
                    <Form.Select
                      value={formData.nameP?.id || ""}
                      onChange={(e) => {
                        const selected = primaryNames.find((pn) => pn.id.toString() === e.target.value);
                        handleFormChange("nameP", selected);  // store whole object
                      }}
                    >
                      <option value="">Select Primary Name</option>
                      {primaryNames.map((pn) => (
                        <option key={pn.id} value={pn.id}>
                          {pn.short_name} - {pn.description}
                        </option>
                      ))}
                    </Form.Select>
                    {/* <Form.Select
                      value={formData.nameP}
                      onChange={(e) => handleFormChange("nameP", e.target.value)}
                    >
                      <option value="">Select Primary Name</option>
                      {primaryNames.map((pn) => (
                        <option key={pn.id} value={pn.id}>
                          {pn.short_name} - {pn.description}
                        </option>
                      ))}
                    </Form.Select> */}
                    <Button variant="primary" size="sm" onClick={() => { setAddType("primary"); setShowAddModal(true); }}>
                      <Plus size={16} />
                    </Button>
                  </InputGroup>
                </Form.Group>
              </div>

              {/* Secondary Name */}
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Secondary Name</Form.Label>
                  <InputGroup>
                    <Form.Select
                      value={formData.nameS?.id || ""}
                      onChange={(e) => {
                        const selected = secondaryNames.find((sn) => sn.id.toString() === e.target.value);
                        handleFormChange("nameS", selected);  // store whole object
                      }}
                    >
                      <option value="">Select Secondary Name</option>
                      {secondaryNames.map((sn) => (
                        <option key={sn.id} value={sn.id}>
                          {sn.short_name} - {sn.description}
                        </option>
                      ))}
                    </Form.Select>
                    <Button variant="primary" size="sm" onClick={() => { setAddType("secondary"); setShowAddModal(true); }}>
                      <Plus size={16} />
                    </Button>
                  </InputGroup>
                </Form.Group>
              </div>

              {/* Watt (multi) */}
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Watt</Form.Label>
                  <InputGroup>
                    <Form.Select onChange={(e) => handleSelectOption("watt", e.target.value)}>
                      <option value="">Select Watt</option>
                      {availableWatts.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.short_name} - {w.description}
                        </option>
                      ))}
                    </Form.Select>
                    <Button variant="primary" size="sm" onClick={() => { setAddType("watt"); setShowAddModal(true); }}>
                      <Plus size={16} />
                    </Button>
                  </InputGroup>
                  <div className="mt-2 d-flex flex-wrap gap-2">
                    {selectedWatts.map((w) => (
                      <span key={w.id} className="badge bg-primary">
                        {w.short_name}
                        <button
                          type="button"
                          className="btn-close btn-close-white btn-sm ms-2"
                          onClick={() => handleRemoveSelected("watt", w)}
                        ></button>
                      </span>
                    ))}
                  </div>
                </Form.Group>
              </div>

              {/* Mount (multi) */}
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Mount</Form.Label>
                  <InputGroup>
                    <Form.Select onChange={(e) => handleSelectOption("mount", e.target.value)}>
                      <option value="">Select Mount</option>
                      {availableMounts.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.short_name} - {m.description}
                        </option>
                      ))}
                    </Form.Select>
                    <Button variant="primary" size="sm" onClick={() => { setAddType("mount"); setShowAddModal(true); }}>
                      <Plus size={16} />
                    </Button>
                  </InputGroup>
                  <div className="mt-2 d-flex flex-wrap gap-2">
                    {selectedMounts.map((m) => (
                      <span key={m.id} className="badge bg-success">
                        {m.short_name}
                        <button
                          type="button"
                          className="btn-close btn-close-white btn-sm ms-2"
                          onClick={() => handleRemoveSelected("mount", m)}
                        ></button>
                      </span>
                    ))}
                  </div>
                </Form.Group>
              </div>

              {/* Shape (multi) */}
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Shape</Form.Label>
                  <InputGroup>
                    <Form.Select onChange={(e) => handleSelectOption("shape", e.target.value)}>
                      <option value="">Select Shape</option>
                      {availableShapes.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.short_name} - {s.description}
                        </option>
                      ))}
                    </Form.Select>
                    <Button variant="primary" size="sm" onClick={() => { setAddType("shape"); setShowAddModal(true); }}>
                      <Plus size={16} />
                    </Button>
                  </InputGroup>
                  <div className="mt-2 d-flex flex-wrap gap-2">
                    {selectedShapes.map((s) => (
                      <span key={s.id} className="badge bg-warning text-dark">
                        {s.short_name}
                        <button
                          type="button"
                          className="btn-close btn-sm ms-2"
                          onClick={() => handleRemoveSelected("shape", s)}
                        ></button>
                      </span>
                    ))}
                  </div>
                </Form.Group>
              </div>

              {/* Color (multi) */}
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Color</Form.Label>
                  <InputGroup>
                    <Form.Select onChange={(e) => handleSelectOption("color", e.target.value)}>
                      <option value="">Select Color</option>
                      {availableColors.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.short_name} - {c.description}
                        </option>
                      ))}
                    </Form.Select>
                    <Button variant="primary" size="sm" onClick={() => { setAddType("color"); setShowAddModal(true); }}>
                      <Plus size={16} />
                    </Button>
                  </InputGroup>
                  <div className="mt-2 d-flex flex-wrap gap-2">
                    {selectedColors.map((c) => (
                      <span key={c.id} className="badge bg-danger">
                        {c.short_name}
                        <button
                          type="button"
                          className="btn-close btn-close-white btn-sm ms-2"
                          onClick={() => handleRemoveSelected("color", c)}
                        ></button>
                      </span>
                    ))}
                  </div>
                </Form.Group>
              </div>

              {/* Description */}
              <div className="col-12">
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formData.description}
                    onChange={(e) => handleFormChange("description", e.target.value)}
                  />
                </Form.Group>
              </div>
            </div>

            {/* Preview */}
            {previewCombinations.length > 0 && (
              <div className="mt-4">
                <h5>Preview</h5>
                <div className="table-responsive text-center">
                  <table className="table table-bordered table-sm">
                    <thead>
                      <tr>
                        <th>Index</th>
                        <th>FG Code</th>
                        <th>FG Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewCombinations.map((combo, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{combo.fg_code}</td>
                          <td>{combo.fg_name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">{isEditMode ? "Update" : "Save"}</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Generic Add Item Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New {addType.charAt(0).toUpperCase() + addType.slice(1)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Short Name</Form.Label>
              <Form.Control
                type="text"
                value={newItem.short_name}
                onChange={(e) => setNewItem({ ...newItem, short_name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveNewItem}>Save</Button>
        </Modal.Footer>
      </Modal>
    </MainCard>
  );
}
