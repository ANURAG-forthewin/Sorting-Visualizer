"use strict";
class sortAlgorithms {
    constructor(time) {
        this.list = document.querySelectorAll(".cell");
        this.size = this.list.length;
        this.time = time;
        this.help = new Helper(this.time, this.list);

        // Ensure each bar has a number inside it
        this.list.forEach(cell => {
            const value = cell.getAttribute("value");
            const numberText = document.createElement('span');
            numberText.classList.add('value-text');
            numberText.textContent = value; // Set the number value on the bar
            cell.appendChild(numberText);
        });
    }

    // Swap function: updates both the value and the number text inside the bars
    swap = async (index1, index2) => {
        await this.help.pause();

        let value1 = this.list[index1].getAttribute("value");
        let value2 = this.list[index2].getAttribute("value");

        // Swap the values in the attributes
        this.list[index1].setAttribute("value", value2);
        this.list[index2].setAttribute("value", value1);

        // Update the heights of the bars
        this.list[index1].style.height = `${3.8 * value2}px`;
        this.list[index2].style.height = `${3.8 * value1}px`;

        // Update the text content inside the bars to reflect the new values
        this.list[index1].querySelector('.value-text').textContent = value2;
        this.list[index2].querySelector('.value-text').textContent = value1;
    };

    // BUBBLE SORT
    BubbleSort = async () => {
        for (let i = 0; i < this.size - 1; ++i) {
            for (let j = 0; j < this.size - i - 1; ++j) {
                await this.help.mark(j);
                await this.help.mark(j + 1);
                if (await this.help.compare(j, j + 1)) {
                    await this.swap(j, j + 1);

                    // After swap, update the number labels inside the bars
                    let value1 = this.list[j].getAttribute("value");
                    let value2 = this.list[j + 1].getAttribute("value");
                    this.list[j].querySelector('.value-text').textContent = value1;
                    this.list[j + 1].querySelector('.value-text').textContent = value2;

                    // Update heights too
                    this.list[j].style.height = `${3.8 * value1}px`;
                    this.list[j + 1].style.height = `${3.8 * value2}px`;
                }
                await this.help.unmark(j);
                await this.help.unmark(j + 1);
            }
            this.list[this.size - i - 1].setAttribute("class", "cell done");
        }
        this.list[0].setAttribute("class", "cell done");
    };

    // INSERTION SORT
    InsertionSort = async () => {
        for (let i = 0; i < this.size - 1; ++i) {
            let j = i;
            while (j >= 0 && await this.help.compare(j, j + 1)) {
                await this.help.mark(j);
                await this.help.mark(j + 1);
                await this.help.pause();
                await this.swap(j, j + 1);

                // After swap, update the number labels inside the bars
                let value1 = this.list[j].getAttribute("value");
                let value2 = this.list[j + 1].getAttribute("value");
                this.list[j].querySelector('.value-text').textContent = value1;
                this.list[j + 1].querySelector('.value-text').textContent = value2;

                // Update heights too
                this.list[j].style.height = `${3.8 * value1}px`;
                this.list[j + 1].style.height = `${3.8 * value2}px`;

                await this.help.unmark(j);
                await this.help.unmark(j + 1);
                j -= 1;
            }
        }
        for (let counter = 0; counter < this.size; ++counter) {
            this.list[counter].setAttribute("class", "cell done");
        }
    };

    // SELECTION SORT
    SelectionSort = async () => {
        for (let i = 0; i < this.size; ++i) {
            let minIndex = i;
            for (let j = i; j < this.size; ++j) {
                await this.help.markSpl(minIndex);
                await this.help.mark(j);
                if (await this.help.compare(minIndex, j)) {
                    await this.help.unmark(minIndex);
                    minIndex = j;
                }
                await this.help.unmark(j);
                await this.help.markSpl(minIndex);
            }
            await this.help.mark(minIndex);
            await this.help.mark(i);
            await this.help.pause();
            await this.swap(minIndex, i);

            // After swap, update the number labels inside the bars
            let value1 = this.list[i].getAttribute("value");
            let value2 = this.list[minIndex].getAttribute("value");
            this.list[i].querySelector('.value-text').textContent = value1;
            this.list[minIndex].querySelector('.value-text').textContent = value2;

            // Update heights too
            this.list[i].style.height = `${3.8 * value1}px`;
            this.list[minIndex].style.height = `${3.8 * value2}px`;

            await this.help.unmark(minIndex);
            this.list[i].setAttribute("class", "cell done");
        }
    };

    // MERGE SORT
    MergeSort = async () => {
        await this.MergeDivider(0, this.size - 1);
        for (let counter = 0; counter < this.size; ++counter) {
            this.list[counter].setAttribute("class", "cell done");
        }
    };

    MergeDivider = async (start, end) => {
        if (start < end) {
            let mid = start + Math.floor((end - start) / 2);
            await this.MergeDivider(start, mid);
            await this.MergeDivider(mid + 1, end);
            await this.Merge(start, mid, end);
        }
    };

    Merge = async (start, mid, end) => {
        let newList = new Array();
        let frontcounter = start;
        let midcounter = mid + 1;

        while (frontcounter <= mid && midcounter <= end) {
            let fvalue = Number(this.list[frontcounter].getAttribute("value"));
            let svalue = Number(this.list[midcounter].getAttribute("value"));
            if (fvalue >= svalue) {
                newList.push(svalue);
                ++midcounter;
            }
            else {
                newList.push(fvalue);
                ++frontcounter;
            }
        }
        while (frontcounter <= mid) {
            newList.push(Number(this.list[frontcounter].getAttribute("value")));
            ++frontcounter;
        }
        while (midcounter <= end) {
            newList.push(Number(this.list[midcounter].getAttribute("value")));
            ++midcounter;
        }

        for (let c = start; c <= end; ++c) {
            this.list[c].setAttribute("class", "cell current");
        }
        for (let c = start, point = 0; c <= end && point < newList.length; ++c, ++point) {
            await this.help.pause();
            this.list[c].setAttribute("value", newList[point]);
            this.list[c].style.height = `${3.5 * newList[point]}px`;

            // Update the number text inside the bar
            this.list[c].querySelector('.value-text').textContent = newList[point];
        }
        for (let c = start; c <= end; ++c) {
            this.list[c].setAttribute("class", "cell");
        }
    };

    // QUICK SORT
    QuickSort = async () => {
        await this.QuickDivider(0, this.size - 1);
        for (let c = 0; c < this.size; ++c) {
            this.list[c].setAttribute("class", "cell done");
        }
    };

    QuickDivider = async (start, end) => {
        if (start < end) {
            let pivot = await this.Partition(start, end);
            await this.QuickDivider(start, pivot - 1);
            await this.QuickDivider(pivot + 1, end);
        }
    };

    Partition = async (start, end) => {
        let pivot = this.list[end].getAttribute("value");
        let prev_index = start - 1;

        await this.help.markSpl(end);
        for (let c = start; c < end; ++c) {
            let currValue = Number(this.list[c].getAttribute("value"));
            await this.help.mark(c);
            if (currValue < pivot) {
                prev_index += 1;
                await this.help.mark(prev_index);
                await this.swap(c, prev_index);

                // After swap, update the number labels inside the bars
                let value1 = this.list[prev_index].getAttribute("value");
                let value2 = this.list[c].getAttribute("value");
                this.list[prev_index].querySelector('.value-text').textContent = value1;
                this.list[c].querySelector('.value-text').textContent = value2;

                // Update heights too
                this.list[prev_index].style.height = `${3.8 * value1}px`;
                this.list[c].style.height = `${3.8 * value2}px`;

                await this.help.unmark(prev_index);
            }
            await this.help.unmark(c);
        }
        await this.swap(end, prev_index + 1);

        // After swap, update the number labels inside the bars
        let value1 = this.list[prev_index + 1].getAttribute("value");
        let value2 = this.list[end].getAttribute("value");
        this.list[prev_index + 1].querySelector('.value-text').textContent = value1;
        this.list[end].querySelector('.value-text').textContent = value2;

        // Update heights too
        this.list[prev_index + 1].style.height = `${3.8 * value1}px`;
        this.list[end].style.height = `${3.8 * value2}px`;

        return prev_index + 1;
    };
}
