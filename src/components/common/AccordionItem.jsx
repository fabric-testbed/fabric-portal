import { Disclosure } from '@headlessui/react';

function AccordionItem({ title, content }) {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="text-left font-bold w-full">
            {title}
          </Disclosure.Button>
          <Disclosure.Panel>
            {content}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
export default AccordionItem;