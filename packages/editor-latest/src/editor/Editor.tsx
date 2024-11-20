import type { FC, PropsWithChildren } from 'react';
import { Suspense, useEffect, useState } from 'react';
import type {
  Callbacks,
  Options,
  RenderOptions,
  ValueWithLegacy,
} from '../core/types';
import { HTMLRenderer } from '../renderer/HTMLRenderer';
import EditableEditor from './EditableEditor';
import 'react/jsx-runtime';

export type EditorProps = {
  /**
   * the current value to display
   */
  value?: ValueWithLegacy | null;

  /**
   * set readOnly=true if you just want to display the content. This will only load the nesseary code.
   */
  readOnly?: boolean;

  /**
   * pass the current language of the content
   */
  lang?: string;
} & Options &
  Callbacks &
  RenderOptions;

const Editor: FC<PropsWithChildren<EditorProps>> = ({
  readOnly = false,
  value = null,
  onChange = null,
  onChangeLang = null,

  lang: passedLang,
  cellPlugins,
  children,
  cellSpacing = null,
  ...options
}) => {
  // mount the component always in readonly, to avoid problems with SSR
  const [renderReadOnly, setRenderReadOnly] = useState(true);
  useEffect(() => {
    setRenderReadOnly(readOnly);
  }, [readOnly]);

  const lang = passedLang ?? options.languages?.[0].lang ?? 'default';

  // FIXME: we need to extact these objects here. It would be best, if the props would already group these,
  // but thats currently not the case and would mean a breaking change
  const renderOptions: Required<RenderOptions> = {
    cellPlugins,
    cellSpacing,
  };

  const callbacks: Required<Callbacks> = {
    onChange,
    onChangeLang,
  };

  return renderReadOnly ? (
    <HTMLRenderer
      value={value}
      cellPlugins={cellPlugins}
      lang={lang}
      cellSpacing={cellSpacing}
    />
  ) : (
    <Suspense
      fallback={
        <HTMLRenderer
          value={value}
          cellPlugins={cellPlugins}
          lang={lang}
          cellSpacing={cellSpacing}
        />
      }
    >
      <EditableEditor
        value={value}
        lang={lang}
        options={options}
        renderOptions={renderOptions}
        callbacks={callbacks}
        children={children}
      />
    </Suspense>
  );
};

export default Editor;