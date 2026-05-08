import { useEffect, useRef } from "react";
import { useOverflowStore } from "@/hooks/useOverflowStore";
import type { Order } from "@/lib/api.types";
import { buildQuantityConfig, getFieldValue, getSwatchByPms } from "@/lib/data";
import { useHnpStore } from "@/hooks/useHnpStore";

/* ---------------- FLYER PREVIEW ---------------- */

const SAFE_MARGIN_IN = 0.1;
const TOP_SAFE_OFFSET_IN = 0.2;
const BOX_GAP_IN = "10px";

type FlyerPreviewProps = {
  isOrder: boolean;
};
function getProofValues(order: Order) {
  return {
    box1Text: order.text.titleLines,
    box2Text: order.text.secondaryLines,
    labelText: order.text.labelLines
  };
}
export function FlyerPreview({
  isOrder,
}: FlyerPreviewProps) {
const order:Order|null     = useHnpStore((s) => s.order.order);

const draft = useHnpStore((s) => s.order.draft);


const orderText = order?.text;
const draftText = draft;


  if(!order || !draft){
    return <>  </>;
  }

  const box1Text = isOrder
  ? orderText?.titleLines
  : draftText?.title;

const box2Text = isOrder
  ? orderText?.secondaryLines
  : draftText?.secondary;

const labelText = isOrder
  ? orderText?.labelLines
  : draftText?.label;

  const product = useHnpStore((s) => s.order.product);

    const documentation = product?.documentation;
    const specs = documentation?.specs ?? [];
  
    const {labelsQty} = buildQuantityConfig(specs ?? []);
    
  
    const PAGE_HEIGHT_IN = getFieldValue(specs, "height_in", 8.5) as number;
    const PAGE_WIDTH_IN = getFieldValue(specs, "width_in", 6) as number;


  const bgClass = getSwatchByPms(order.setup.colorPms).swatch;

  const USABLE_WIDTH_IN = Math.max(PAGE_WIDTH_IN - 0.2, 0);


  const setOverflow = useOverflowStore(
    (s) => s.setOverflow
  );

  /* ---------------- REFS ---------------- */

  const box1Ref = useRef<HTMLDivElement>(null);
  const box2Ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);

  /* ---------------- CHECK FUNCTION ---------------- */

  const isOverflowing = (
    el: HTMLElement | null
  ) => {
    if (!el) return false;

    return (
      el.scrollHeight > el.clientHeight ||
      el.scrollWidth > el.clientWidth
    );
  };

  /* ---------------- LIVE CHECK ---------------- */

  useEffect(() => {
    setOverflow(
      "title",
      isOverflowing(box1Ref.current)
    );

    setOverflow(
      "secondary",
      isOverflowing(box2Ref.current)
    );

    setOverflow(
      "label",
      isOverflowing(labelRef.current)
    );
  }, [box1Text, box2Text, labelText]);

  return (
    <div className="flex justify-center">
      <div className="w-full overflow-x-auto rounded-xl border bg-neutral-100 p-4">
        <div
          className="mx-auto shadow-sm"
          style={{
            backgroundColor: bgClass,
            width: `${PAGE_WIDTH_IN}in`,
            minHeight: `${PAGE_HEIGHT_IN}in`,
            paddingLeft: `${SAFE_MARGIN_IN}in`,
            paddingRight: `${SAFE_MARGIN_IN}in`,
            paddingTop: `${TOP_SAFE_OFFSET_IN}in`,
            paddingBottom: "0.35in",
            boxSizing: "border-box",
          }}
        >
          <div
            className="mx-auto flex flex-col"
            style={{
              width: `${USABLE_WIDTH_IN}in`,
              maxWidth: `${USABLE_WIDTH_IN}in`,
              gap: `${BOX_GAP_IN}in`,
            }}
          >
            <div ref={box1Ref}
            className="box1Text mb-2"
            id="box1Text"
           style={{
            fontSize: "26pt",
            lineHeight: 1.05,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.02em",
            maxHeight: "1.2in",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflowWrap: "anywhere",
            textAlign: "center",
        }}
      >
        {box1Text}
      </div>
            <div
                                      ref={box2Ref}

            id="box2Text"
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: "16pt",
              lineHeight: 1.25,
              width: "80%",
              margin: "0 auto",
              maxHeight: "1.8in",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 4,
              WebkitBoxOrient: "vertical",
              overflowWrap: "anywhere",
              textAlign: "center",
            }}
          >
            {box2Text}
          </div>
          </div>

          <div
            className="mx-auto mt-5 grid grid-cols-4 gap-2 slots gap-y-0"
            id="slots"
            style={{ width: `${USABLE_WIDTH_IN}in` }}
          >
            {Array.from({ length: labelsQty }).map((_, i) => (
              <div
            key={i}
            className="flex slot items-center justify-center border border-black text-center"
            style={{
              height: "0.51in",
              width: "100%",
              overflow: "hidden",
              boxSizing: "border-box",
            }}
          >
            <p
            ref={
                    i === 0
                      ? labelRef
                      : undefined
                  }
              style={{
                fontSize: "12px",
                lineHeight: 1.1,
                width: "100%",
                padding:"2px",
                wordBreak: "break-all",
                overflowWrap: "anywhere",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                color:"#544b4b"
              }}
            >
              {labelText}
            </p>
          </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
