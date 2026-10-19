export function HAIRLINE_Divider() {
  return <div role="separator" className="line-divider hairline-divider" />;
}

export function BAR_Divider() {
  return <div role="separator" className="line-divider bar-divider" />;
}

export function DOUBLEBAR_Divider() {
  return (
    <div role="separator" className="container-doubleBar">
      <div className="line-divider bar-divider" />
      <div className="line-divider bar-divider" />
    </div>
  );
}
